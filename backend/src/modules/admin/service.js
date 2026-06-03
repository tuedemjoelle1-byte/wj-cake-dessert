import { getRepository } from "../../data/store.js";
import { audit } from "../audit/service.js";

const repository = getRepository();
const allowedOrderStatuses = ["en-attente", "confirmee", "en-preparation", "prete", "livree", "annulee"];
const allowedQuoteStatuses = ["en-attente", "traite", "valide", "refuse"];

export function getDashboard() {
  return repository.getAdminDashboard();
}

export function listAdminOrders(filters = {}) {
  return repository.listAdminOrders(filters);
}

export function getAdminOrderByNumber(number) {
  return repository.getAdminOrderByNumber(number);
}

export async function updateAdminOrderStatus(number, status) {
  if (!allowedOrderStatuses.includes(status)) {
    const error = new Error("Statut de commande invalide.");
    error.status = 400;
    error.code = "STATUT_COMMANDE_INVALIDE";
    error.details = { allowed: allowedOrderStatuses };
    throw error;
  }

  const current = await repository.getOrderByNumber(number);
  if (!current) {
    const error = new Error("Commande introuvable.");
    error.status = 404;
    error.code = "COMMANDE_INTROUVABLE";
    throw error;
  }

  const updated = await repository.updateOrderStatus(number, status);

  await audit({
    action: "admin.order.status.update",
    actorType: "admin",
    actorId: "dashboard",
    targetType: "order",
    targetId: updated.number,
    metadata: {
      previousStatus: current.status,
      nextStatus: updated.status
    }
  });

  return repository.getAdminOrderByNumber(number);
}

export function listAdminQuoteRequests(filters = {}) {
  return repository.listAdminQuoteRequests(filters);
}

export function getAdminQuoteRequestById(id) {
  return repository.getAdminQuoteRequestById(id);
}

export async function updateAdminQuoteRequestStatus(id, status) {
  if (!allowedQuoteStatuses.includes(status)) {
    const error = new Error("Statut de devis invalide.");
    error.status = 400;
    error.code = "STATUT_DEVIS_INVALIDE";
    error.details = { allowed: allowedQuoteStatuses };
    throw error;
  }

  const current = await repository.getAdminQuoteRequestById(id);
  if (!current) {
    const error = new Error("Demande de devis introuvable.");
    error.status = 404;
    error.code = "DEVIS_INTROUVABLE";
    throw error;
  }

  const updated = await repository.updateQuoteRequestStatus(id, status);

  await audit({
    action: "admin.quote-request.status.update",
    actorType: "admin",
    actorId: "dashboard",
    targetType: "quote-request",
    targetId: updated.id,
    metadata: {
      previousStatus: current.status,
      nextStatus: updated.status
    }
  });

  return repository.getAdminQuoteRequestById(id);
}

export function listAdminPayments(filters = {}) {
  return repository.listAdminPayments(filters);
}

import { getRepository } from "../../data/store.js";
import { createPublicId, timestamp } from "../../lib/ids.js";

const repository = getRepository();

function toOrderNumber() {
  return `CMD-${Date.now()}`;
}

export async function createOrder(input) {
  if (!input.cartId) {
    const error = new Error("Le champ cartId est obligatoire.");
    error.status = 400;
    error.code = "ERREUR_VALIDATION";
    error.details = { missing: ["cartId"] };
    throw error;
  }

  const cart = await repository.getCartById(input.cartId);
  if (!cart) {
    const error = new Error("Panier introuvable.");
    error.status = 404;
    error.code = "PANIER_INTROUVABLE";
    throw error;
  }

  const order = {
    id: createPublicId("ord"),
    number: toOrderNumber(),
    cartId: cart.id,
    customerEmail: input.customerEmail || cart.customerEmail || null,
    customerName: input.customerName || null,
    fulfillmentMode: input.fulfillmentMode || "delivery",
    deliveryAddress: input.deliveryAddress || null,
    slotId: input.slotId || null,
    status: "en-attente",
    paymentStatus: "a-payer",
    items: cart.items,
    totals: cart.totals,
    createdAt: timestamp()
  };

  return repository.createOrder(order);
}

export function listOrders() {
  return repository.listOrders();
}

export function getOrderByNumber(number) {
  return repository.getOrderByNumber(number);
}

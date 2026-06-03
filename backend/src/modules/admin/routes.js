import { fail, ok } from "../../core/http.js";
import { readBearerToken } from "../../lib/auth.js";
import {
  getAdminOrderByNumber,
  getAdminQuoteRequestById,
  getDashboard,
  listAdminOrders,
  listAdminPayments,
  listAdminQuoteRequests,
  updateAdminOrderStatus,
  updateAdminQuoteRequestStatus
} from "./service.js";
import { getCurrentAdmin } from "./auth-service.js";

function requireAdmin(req) {
  const token = readBearerToken(req);
  return getCurrentAdmin(token);
}

export function registerAdminRoutes(router) {
  router.get("/api/v1/admin/dashboard", ({ req, res }) => {
    return Promise.resolve(requireAdmin(req))
      .then(() => getDashboard())
      .then((item) => ok(res, { item }))
      .catch((error) =>
        fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
      );
  });

  router.get("/api/v1/admin/orders", ({ req, res, url }) => {
    const page = Number(url.searchParams.get("page") || 1);
    const pageSize = Number(url.searchParams.get("pageSize") || 10);

    return Promise.resolve(requireAdmin(req))
      .then(() =>
        listAdminOrders({
          page: Number.isFinite(page) && page > 0 ? page : 1,
          pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10,
          status: url.searchParams.get("status") || "",
          email: url.searchParams.get("email") || "",
          fulfillmentMode: url.searchParams.get("fulfillmentMode") || "",
          date: url.searchParams.get("date") || ""
        })
      )
      .then((result) => ok(res, result))
      .catch((error) =>
        fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
      );
  });

  router.get("/api/v1/admin/orders/:number", ({ req, res, params }) => {
    return Promise.resolve(requireAdmin(req))
      .then(() => getAdminOrderByNumber(params.number))
      .then((item) => {
        if (!item) {
          return fail(res, 404, "COMMANDE_INTROUVABLE", "Commande introuvable.");
        }

        return ok(res, { item });
      })
      .catch((error) =>
        fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
      );
  });

  router.patch("/api/v1/admin/orders/:number/status", ({ req, res, params, body }) => {
    return Promise.resolve(requireAdmin(req))
      .then(() => updateAdminOrderStatus(params.number, body.status))
      .then((item) => ok(res, { item }))
      .catch((error) =>
        fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
      );
  });

  router.get("/api/v1/admin/quote-requests", ({ req, res, url }) => {
    const page = Number(url.searchParams.get("page") || 1);
    const pageSize = Number(url.searchParams.get("pageSize") || 10);

    return Promise.resolve(requireAdmin(req))
      .then(() =>
        listAdminQuoteRequests({
          page: Number.isFinite(page) && page > 0 ? page : 1,
          pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10,
          status: url.searchParams.get("status") || "",
          email: url.searchParams.get("email") || "",
          date: url.searchParams.get("date") || ""
        })
      )
      .then((result) => ok(res, result))
      .catch((error) =>
        fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
      );
  });

  router.get("/api/v1/admin/quote-requests/:id", ({ req, res, params }) => {
    return Promise.resolve(requireAdmin(req))
      .then(() => getAdminQuoteRequestById(params.id))
      .then((item) => {
        if (!item) {
          return fail(res, 404, "DEVIS_INTROUVABLE", "Demande de devis introuvable.");
        }

        return ok(res, { item });
      })
      .catch((error) =>
        fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
      );
  });

  router.patch("/api/v1/admin/quote-requests/:id/status", ({ req, res, params, body }) => {
    return Promise.resolve(requireAdmin(req))
      .then(() => updateAdminQuoteRequestStatus(params.id, body.status))
      .then((item) => ok(res, { item }))
      .catch((error) =>
        fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
      );
  });

  router.get("/api/v1/admin/payments", ({ req, res, url }) => {
    const page = Number(url.searchParams.get("page") || 1);
    const pageSize = Number(url.searchParams.get("pageSize") || 10);

    return Promise.resolve(requireAdmin(req))
      .then(() =>
        listAdminPayments({
          page: Number.isFinite(page) && page > 0 ? page : 1,
          pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10,
          status: url.searchParams.get("status") || "",
          provider: url.searchParams.get("provider") || "",
          date: url.searchParams.get("date") || ""
        })
      )
      .then((result) => ok(res, result))
      .catch((error) =>
        fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
      );
  });
}

import { fail, ok } from "../../core/http.js";
import { createOrder, getOrderByNumber, listOrders } from "./service.js";

export function registerOrderRoutes(router) {
  router.get("/api/v1/orders", ({ res }) => {
    return Promise.resolve(listOrders()).then((items) => ok(res, { items }));
  });

  router.post("/api/v1/orders", ({ res, body }) => {
    return Promise.resolve(createOrder(body))
      .then((order) => ok(res, { item: order }, 201))
      .catch((error) =>
        fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
      );
  });

  router.get("/api/v1/orders/:number", ({ res, params }) => {
    return Promise.resolve(getOrderByNumber(params.number)).then((order) => {
      if (!order) {
        return fail(res, 404, "COMMANDE_INTROUVABLE", "Commande introuvable.");
      }

      return ok(res, { item: order });
    });
  });
}

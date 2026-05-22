import { fail, ok } from "../../core/http.js";
import { createPaymentIntent, listPayments } from "./service.js";

export function registerPaymentRoutes(router) {
  router.get("/api/v1/payments", ({ res }) => {
    return Promise.resolve(listPayments()).then((items) => ok(res, { items }));
  });

  router.post("/api/v1/payments/intent", ({ res, body }) => {
    return Promise.resolve(createPaymentIntent(body))
      .then((payment) => ok(res, { item: payment }, 201))
      .catch((error) =>
        fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
      );
  });
}

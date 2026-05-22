import { fail, ok } from "../../core/http.js";
import { createCart, updateCart } from "./service.js";

export function registerCartRoutes(router) {
  router.post("/api/v1/cart", ({ res, body }) => {
    try {
      return Promise.resolve(createCart(body))
        .then((cart) => ok(res, { item: cart }, 201))
        .catch((error) =>
          fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
        );
    } catch (error) {
      return fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details);
    }
  });

  router.patch("/api/v1/cart/:id", ({ res, params, body }) => {
    try {
      return Promise.resolve(updateCart(params.id, body))
        .then((cart) => ok(res, { item: cart }))
        .catch((error) =>
          fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
        );
    } catch (error) {
      return fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details);
    }
  });
}

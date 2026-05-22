import { fail, ok } from "../../core/http.js";
import { requireFields } from "../../core/validation.js";
import { createQuoteRequest } from "./service.js";

export function registerCustomCakeRoutes(router) {
  router.post("/api/v1/custom-cakes/quote-requests", ({ res, body }) => {
    try {
      requireFields(body, ["customerName", "email", "phone", "eventDate"]);
      return Promise.resolve(createQuoteRequest(body))
        .then((request) => ok(res, { item: request }, 201))
        .catch((error) =>
          fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
        );
    } catch (error) {
      return fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details);
    }
  });
}

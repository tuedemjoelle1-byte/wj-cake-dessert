import { fail, ok } from "../../core/http.js";
import { requireFields } from "../../core/validation.js";
import { readBearerToken } from "../../lib/auth.js";
import { getCurrentAdmin, loginAdmin } from "./auth-service.js";

export function registerAdminAuthRoutes(router) {
  router.post("/api/v1/admin/auth/login", ({ res, body }) => {
    try {
      requireFields(body, ["email", "password"]);
      return Promise.resolve(loginAdmin(body))
        .then((result) => ok(res, result))
        .catch((error) =>
          fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
        );
    } catch (error) {
      return fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details);
    }
  });

  router.get("/api/v1/admin/me", ({ req, res }) => {
    const token = readBearerToken(req);
    return Promise.resolve(getCurrentAdmin(token))
      .then((item) => ok(res, { item }))
      .catch((error) =>
        fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
      );
  });
}

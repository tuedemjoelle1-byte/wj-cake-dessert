import { ok } from "../../core/http.js";
import { readBearerToken } from "../../lib/auth.js";
import { getCurrentAdmin } from "../admin/auth-service.js";
import { fail } from "../../core/http.js";
import { listAuditLogs } from "./service.js";

export function registerAuditRoutes(router) {
  router.get("/api/v1/admin/audit-logs", ({ req, res }) => {
    return Promise.resolve(getCurrentAdmin(readBearerToken(req)))
      .then(() => listAuditLogs())
      .then((items) => ok(res, { items }))
      .catch((error) =>
        fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
      );
  });
}

import { ok } from "../../core/http.js";
import { listAuditLogs } from "./service.js";

export function registerAuditRoutes(router) {
  router.get("/api/v1/admin/audit-logs", ({ res }) => {
    return Promise.resolve(listAuditLogs()).then((items) => ok(res, { items }));
  });
}

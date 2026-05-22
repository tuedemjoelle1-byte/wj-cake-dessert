import { ok } from "../../core/http.js";
import { getDashboard } from "./service.js";

export function registerAdminRoutes(router) {
  router.get("/api/v1/admin/dashboard", ({ res }) => {
    return Promise.resolve(getDashboard()).then((item) => ok(res, { item }));
  });
}

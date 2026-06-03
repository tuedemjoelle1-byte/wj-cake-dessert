import { fail, ok } from "../../core/http.js";
import { readBearerToken } from "../../lib/auth.js";
import { getCurrentAdmin } from "../admin/auth-service.js";
import { listNotifications } from "./service.js";

export function registerNotificationRoutes(router) {
  router.get("/api/v1/admin/notifications", ({ req, res }) => {
    return Promise.resolve(getCurrentAdmin(readBearerToken(req)))
      .then(() => listNotifications())
      .then((items) => ok(res, { items }))
      .catch((error) =>
        fail(res, error.status || 500, error.code || "INTERNAL_ERROR", error.message, error.details)
      );
  });
}

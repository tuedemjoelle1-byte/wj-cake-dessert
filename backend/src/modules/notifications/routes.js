import { ok } from "../../core/http.js";
import { listNotifications } from "./service.js";

export function registerNotificationRoutes(router) {
  router.get("/api/v1/admin/notifications", ({ res }) => {
    return Promise.resolve(listNotifications()).then((items) => ok(res, { items }));
  });
}

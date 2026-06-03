import { createRouter } from "./core/router.js";
import { registerSystemRoutes } from "./modules/system/routes.js";
import { registerAuthRoutes } from "./modules/auth/routes.js";
import { registerAuditRoutes } from "./modules/audit/routes.js";
import { registerCatalogRoutes } from "./modules/catalog/routes.js";
import { registerCartRoutes } from "./modules/cart/routes.js";
import { registerCustomCakeRoutes } from "./modules/custom-cakes/routes.js";
import { registerOrderRoutes } from "./modules/orders/routes.js";
import { registerPaymentRoutes } from "./modules/payments/routes.js";
import { registerDeliveryRoutes } from "./modules/delivery/routes.js";
import { registerAdminRoutes } from "./modules/admin/routes.js";
import { registerAdminAuthRoutes } from "./modules/admin/auth-routes.js";
import { registerNotificationRoutes } from "./modules/notifications/routes.js";

export function createApp() {
  const router = createRouter();

  registerSystemRoutes(router);
  registerAuthRoutes(router);
  registerAuditRoutes(router);
  registerCatalogRoutes(router);
  registerCartRoutes(router);
  registerCustomCakeRoutes(router);
  registerOrderRoutes(router);
  registerPaymentRoutes(router);
  registerDeliveryRoutes(router);
  registerAdminAuthRoutes(router);
  registerAdminRoutes(router);
  registerNotificationRoutes(router);

  return router.handler;
}

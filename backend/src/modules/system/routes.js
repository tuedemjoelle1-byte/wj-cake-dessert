import { ok } from "../../core/http.js";
import { buildOpenApiSpec, renderSwaggerHtml } from "./swagger.js";

export function registerSystemRoutes(router) {
  router.get("/health", ({ res }) => {
    ok(res, {
      statut: "ok",
      service: "wj-api",
      timestamp: new Date().toISOString()
    });
  });

  router.get("/api", ({ res }) => {
    ok(res, {
      nom: "API W.J. Cake & Dessert",
      version: "0.4.0",
      cheminBase: "/api/v1",
      modules: [
        "auth",
        "catalog",
        "cart",
        "custom-cakes",
        "orders",
        "payments",
        "delivery",
        "admin",
        "notifications",
        "audit",
        "swagger"
      ]
    });
  });

  router.get("/api/v1", ({ res }) => {
    ok(res, {
      message: "Backend MVP W.J. Cake & Dessert",
      routes: {
        authentification: ["/api/v1/auth/register", "/api/v1/auth/login"],
        catalogue: ["/api/v1/catalog/categories", "/api/v1/catalog/products"],
        panier: ["/api/v1/cart", "/api/v1/cart/:id"],
        gateauxPersonnalises: ["/api/v1/custom-cakes/quote-requests"],
        commandes: ["/api/v1/orders", "/api/v1/orders/:number"],
        paiements: ["/api/v1/payments", "/api/v1/payments/intent"],
        livraison: ["/api/v1/delivery/zones", "/api/v1/delivery/slots"],
        admin: [
          "/api/v1/admin/dashboard",
          "/api/v1/admin/orders",
          "/api/v1/admin/orders/:number",
          "/api/v1/admin/orders/:number/status",
          "/api/v1/admin/quote-requests",
          "/api/v1/admin/quote-requests/:id",
          "/api/v1/admin/quote-requests/:id/status",
          "/api/v1/admin/payments",
          "/api/v1/admin/notifications",
          "/api/v1/admin/audit-logs"
        ],
        swagger: ["/swagger", "/swagger.json"]
      }
    });
  });

  router.get("/swagger.json", ({ res }) => {
    ok(res, buildOpenApiSpec());
  });

  router.get("/swagger", ({ res }) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(renderSwaggerHtml());
  });
}

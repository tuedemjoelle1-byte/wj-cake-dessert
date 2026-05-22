import { fail, ok } from "../../core/http.js";
import { getQuery } from "../../core/request.js";
import { getProductBySlug, listCategories, listProducts } from "./service.js";

export function registerCatalogRoutes(router) {
  router.get("/api/v1/catalog/categories", ({ res }) => {
    return Promise.resolve(listCategories()).then((items) => ok(res, { items }));
  });

  router.get("/api/v1/catalog/products", ({ res, url }) => {
    return Promise.resolve(
      listProducts({
        category: getQuery(url, "category"),
        q: getQuery(url, "q")
      })
    ).then((items) => ok(res, { items }));
  });

  router.get("/api/v1/catalog/products/:slug", ({ res, params }) => {
    return Promise.resolve(getProductBySlug(params.slug)).then((product) => {
      if (!product) {
        return fail(res, 404, "PRODUIT_INTROUVABLE", "Produit introuvable.");
      }

      return ok(res, { item: product });
    });
  });
}

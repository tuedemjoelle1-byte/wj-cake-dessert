import { fail } from "./http.js";
import { readJson } from "./request.js";

function splitPath(pathname) {
  return pathname.split("/").filter(Boolean);
}

function matchPath(pattern, pathname) {
  const patternParts = splitPath(pattern);
  const pathParts = splitPath(pathname);

  if (patternParts.length !== pathParts.length) {
    return null;
  }

  const params = {};

  for (let index = 0; index < patternParts.length; index += 1) {
    const patternPart = patternParts[index];
    const pathPart = pathParts[index];

    if (patternPart.startsWith(":")) {
      params[patternPart.slice(1)] = decodeURIComponent(pathPart);
      continue;
    }

    if (patternPart !== pathPart) {
      return null;
    }
  }

  return params;
}

export function createRouter() {
  const routes = [];

  const add = (method, path, handler) => {
    routes.push({ method, path, handler });
  };

  const handler = async (req, res) => {
    const method = req.method || "GET";
    const url = new URL(req.url || "/", "http://localhost");

    for (const route of routes) {
      if (route.method !== method) {
        continue;
      }

      const params = matchPath(route.path, url.pathname);
      if (!params) {
        continue;
      }

      try {
        const body = method === "GET" || method === "HEAD" ? {} : await readJson(req);
        const context = { req, res, url, params, body };
        return await route.handler(context);
      } catch (error) {
        if (error instanceof SyntaxError) {
          return fail(res, 400, "JSON_INVALIDE", "Le corps de la requete doit etre un JSON valide.");
        }

        return fail(res, 500, "ERREUR_INTERNE", "Une erreur serveur inattendue est survenue.", {
          message: error.message
        });
      }
    }

    return fail(res, 404, "ROUTE_INTROUVABLE", "Route introuvable.", {
      method,
      path: url.pathname
    });
  };

  return {
    get: (path, routeHandler) => add("GET", path, routeHandler),
    post: (path, routeHandler) => add("POST", path, routeHandler),
    patch: (path, routeHandler) => add("PATCH", path, routeHandler),
    delete: (path, routeHandler) => add("DELETE", path, routeHandler),
    handler
  };
}

import { createServer, request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.env.ADMIN_PORT || 4179);
const root = fileURLToPath(new URL("./src/", import.meta.url));
const clientThemePath = fileURLToPath(new URL("../frontend/src/styles.css", import.meta.url));
const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8"
};

createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const isLocalAdminPath = process.env.VERCEL !== "1" && url.pathname.startsWith("/admin");

  if (url.pathname === "/client-theme.css" || (isLocalAdminPath && url.pathname === "/admin/client-theme.css")) {
    res.writeHead(200, {
      "Content-Type": "text/css; charset=utf-8",
      "Cache-Control": "no-store"
    });
    res.end(readFileSync(clientThemePath));
    return;
  }

  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/swagger") ||
    url.pathname === "/health"
  ) {
    try {
      await proxyRequest(req, res, url);
    } catch (error) {
      res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify({
          error: {
            code: "ADMIN_PROXY_ERROR",
            message: "Impossible de joindre le backend.",
            details: { message: error.message }
          }
        })
      );
    }
    return;
  }

  const normalizedPathname = isLocalAdminPath
    ? url.pathname.replace(/^\/admin(?=\/|$)/, "") || "/"
    : url.pathname;
  const pathname = normalizedPathname === "/" ? "/index.html" : normalizedPathname;
  const safePath = normalize(pathname)
    .replace(/^(\.\.[/\\])+/, "")
    .replace(/^[/\\]+/, "");
  const filePath = join(root, safePath);

  if (!filePath.startsWith(root) || !existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Page introuvable.");
    return;
  }

  const extension = extname(filePath);
  const contentType = mimeTypes[extension] || "application/octet-stream";
  const file = readFileSync(filePath);

  res.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": "no-store"
  });
  res.end(file);
}).listen(port, () => {
  console.log(`WJ Admin listening on http://localhost:${port}`);
});

async function proxyRequest(req, res, url) {
  const upstreamUrl = buildBackendUrl(req, url);
  const body =
    req.method === "GET" || req.method === "HEAD" ? undefined : await readRequestBody(req);
  const headers = {};

  for (const [key, value] of Object.entries(req.headers)) {
    if (
      !value ||
      key.toLowerCase() === "host" ||
      key.toLowerCase() === "content-length" ||
      key.toLowerCase() === "connection"
    ) {
      continue;
    }

    headers[key] = value;
  }

  if (body) {
    headers["content-length"] = String(body.length);
  }

  await new Promise((resolve, reject) => {
    const requestImpl = upstreamUrl.protocol === "https:" ? httpsRequest : httpRequest;
    const proxy = requestImpl(
      {
        protocol: upstreamUrl.protocol,
        hostname: upstreamUrl.hostname,
        port: upstreamUrl.port,
        path: `${upstreamUrl.pathname}${upstreamUrl.search}`,
        method: req.method,
        headers
      },
      (upstreamResponse) => {
        const responseHeaders = { ...upstreamResponse.headers };

        res.writeHead(upstreamResponse.statusCode || 502, responseHeaders);
        upstreamResponse.pipe(res);
        upstreamResponse.on("end", resolve);
      }
    );

    proxy.on("error", reject);
    if (body) {
      proxy.write(body);
    }
    proxy.end();
  });
}

function buildBackendUrl(req, url) {
  const base = resolveBackendBase(req);
  const relativePath = `${String(url.pathname || "/").replace(/^\/+/, "")}${url.search || ""}`;
  return new URL(relativePath, base);
}

function resolveBackendBase(req) {
  if (process.env.VERCEL === "1" && req.headers.host) {
    return `https://${req.headers.host}/_/backend/`;
  }

  return backendUrl.endsWith("/") ? backendUrl : `${backendUrl}/`;
}

async function readRequestBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return chunks.length > 0 ? Buffer.concat(chunks) : undefined;
}

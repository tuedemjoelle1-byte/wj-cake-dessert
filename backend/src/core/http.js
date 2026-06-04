import { env } from "../config/env.js";

function normaliseOrigin(origin) {
  return origin.replace(/\/+$/, "");
}

function parseAllowedOrigins() {
  const origins = new Set([
    normaliseOrigin(env.appUrl),
    "http://localhost:4173",
    "http://localhost:4179",
    "http://127.0.0.1:4173",
    "http://127.0.0.1:4179"
  ]);

  if (env.allowedOrigins) {
    for (const origin of env.allowedOrigins.split(",")) {
      const trimmed = origin.trim();
      if (trimmed) {
        origins.add(normaliseOrigin(trimmed));
      }
    }
  }

  return origins;
}

const allowedOrigins = parseAllowedOrigins();

function isTrustedOrigin(origin) {
  if (!origin) {
    return false;
  }

  const normalised = normaliseOrigin(origin);
  if (allowedOrigins.has(normalised)) {
    return true;
  }

  return /^https:\/\/[-a-z0-9]+(?:[-a-z0-9]*\.)?vercel\.app$/i.test(normalised);
}

export function applySecurityHeaders(req, res) {
  const origin = req.headers.origin;

  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");

  if (isTrustedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  }
}

export function sendJson(res, status, payload) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.writeHead(status);
  res.end(JSON.stringify(payload, null, 2));
}

export function ok(res, payload, status = 200) {
  sendJson(res, status, payload);
}

export function fail(res, status, code, message, details) {
  sendJson(res, status, {
    error: {
      code,
      message,
      details: details || null
    }
  });
}

export function noContent(res, status = 204) {
  res.writeHead(status);
  res.end();
}

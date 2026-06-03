import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "../config/env.js";

const secret = env.supabaseServiceRoleKey || "wj-local-admin-secret";

function toBase64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createAdminSession(email) {
  const createdAt = new Date().toISOString();
  const payload = JSON.stringify({
    email,
    role: "admin",
    createdAt
  });
  const encoded = toBase64Url(payload);
  const signature = sign(encoded);

  return {
    accessToken: `wja.${encoded}.${signature}`,
    admin: {
      email,
      role: "admin"
    },
    createdAt
  };
}

export function decodeAdminSession(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "wja") {
    return null;
  }

  const [, encoded, signature] = parts;
  const expected = sign(encoded);

  if (
    Buffer.byteLength(signature) !== Buffer.byteLength(expected) ||
    !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encoded));
    if (payload.role !== "admin" || !payload.email) {
      return null;
    }

    return {
      email: payload.email,
      role: payload.role,
      createdAt: payload.createdAt,
      accessToken: token
    };
  } catch {
    return null;
  }
}

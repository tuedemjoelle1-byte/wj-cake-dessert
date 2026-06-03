import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "../config/env.js";

const secret = env.supabaseServiceRoleKey || "wj-local-session-secret";

function toBase64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createSessionTokens(userId) {
  const createdAt = new Date().toISOString();
  const payload = JSON.stringify({ userId, createdAt });
  const encoded = toBase64Url(payload);
  const signature = sign(encoded);

  return {
    id: `sess_${userId}_${Date.now()}`,
    accessToken: `wj.${encoded}.${signature}`,
    refreshToken: `wjr.${encoded}.${signature}`,
    userId,
    createdAt
  };
}

export function decodeSessionToken(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
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
    return {
      id: `sess_${payload.userId}`,
      accessToken: token,
      refreshToken: null,
      userId: payload.userId,
      createdAt: payload.createdAt
    };
  } catch {
    return null;
  }
}

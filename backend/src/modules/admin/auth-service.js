import { env } from "../../config/env.js";
import { decodeAdminSession, createAdminSession } from "../../lib/admin-session.js";

export function loginAdmin(input) {
  const email = String(input.email || "").trim().toLowerCase();
  const password = String(input.password || "");

  if (email !== env.adminEmail.toLowerCase() || password !== env.adminPassword) {
    const error = new Error("Identifiants admin invalides.");
    error.status = 401;
    error.code = "IDENTIFIANTS_ADMIN_INVALIDES";
    throw error;
  }

  return createAdminSession(env.adminEmail);
}

export function getCurrentAdmin(token) {
  const session = decodeAdminSession(token);
  if (!session) {
    const error = new Error("Session admin invalide.");
    error.status = 401;
    error.code = "SESSION_ADMIN_INVALIDE";
    throw error;
  }

  return {
    email: session.email,
    role: session.role
  };
}

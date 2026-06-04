import { loadEnvFile } from "./load-env.js";

loadEnvFile();

function readEnv(name, fallback = "") {
  const value = process.env[name];
  return typeof value === "string" && value.length > 0 ? value.trim() : fallback;
}

export const env = {
  appEnv: readEnv("APP_ENV", "development"),
  appUrl: readEnv("APP_URL", "http://localhost:4000"),
  port: Number(process.env.PORT || 4000),
  dataProvider: readEnv("DATA_PROVIDER", "memory"),
  adminEmail: readEnv("ADMIN_EMAIL", "admin@wj.local"),
  adminPassword: readEnv("ADMIN_PASSWORD", "admin1234"),
  supabaseUrl: readEnv("SUPABASE_URL"),
  supabaseAnonKey: readEnv("SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: readEnv("SUPABASE_SERVICE_ROLE_KEY"),
  supabaseSchema: readEnv("SUPABASE_SCHEMA", "public"),
  allowedOrigins: readEnv("ALLOWED_ORIGINS")
};

export function isSupabaseConfigured() {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}

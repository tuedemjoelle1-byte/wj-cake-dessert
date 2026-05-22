export const env = {
  appEnv: process.env.APP_ENV || "development",
  appUrl: process.env.APP_URL || "http://localhost:4000",
  port: Number(process.env.PORT || 4000),
  dataProvider: process.env.DATA_PROVIDER || "memory",
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  supabaseSchema: process.env.SUPABASE_SCHEMA || "public"
};

export function isSupabaseConfigured() {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}

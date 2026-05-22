import { env, isSupabaseConfigured } from "../../config/env.js";
import { memoryRepository } from "./memory-repository.js";
import { supabaseRepository } from "./supabase-repository.js";

export function getRepository() {
  if (env.dataProvider === "supabase" && isSupabaseConfigured()) {
    return supabaseRepository;
  }

  return memoryRepository;
}

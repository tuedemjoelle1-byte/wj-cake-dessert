import { env, isSupabaseConfigured } from "../../config/env.js";
import { memoryRepository } from "./memory-repository.js";
import { supabaseRepository } from "./supabase-repository.js";

function shouldFallbackToMemory(error) {
  return Boolean(
    error &&
      (error.code === "SUPABASE_NETWORK_ERROR" ||
        error.cause?.code === "ENOTFOUND" ||
        error.cause?.code === "ECONNREFUSED" ||
        error.message === "fetch failed")
  );
}

function createResilientRepository() {
  return new Proxy(supabaseRepository, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver);
      if (typeof value !== "function") {
        return value;
      }

      return async (...args) => {
        try {
          return await value.apply(target, args);
        } catch (error) {
          if (!shouldFallbackToMemory(error)) {
            throw error;
          }

          const fallback = memoryRepository[property];
          if (typeof fallback !== "function") {
            throw error;
          }

          return fallback.apply(memoryRepository, args);
        }
      };
    }
  });
}

const resilientSupabaseRepository = createResilientRepository();

export function getRepository() {
  if (env.dataProvider === "supabase" && isSupabaseConfigured()) {
    return resilientSupabaseRepository;
  }

  return memoryRepository;
}

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
          console.error(
            `[repository] Erreur Supabase sur "${String(property)}":`,
            error.code || error.message,
            error.cause ? `(cause: ${error.cause.code || error.cause.message})` : ""
          );

          if (!shouldFallbackToMemory(error)) {
            console.error(`[repository] Erreur non éligible au fallback mémoire, propagation de l'erreur.`);
            throw error;
          }

          console.warn(`[repository] FALLBACK MEMOIRE utilisé pour "${String(property)}".`);

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
  console.log(
    `[repository] dataProvider="${env.dataProvider}" supabaseConfigured=${isSupabaseConfigured()}`
  );

  if (env.dataProvider === "supabase" && isSupabaseConfigured()) {
    return resilientSupabaseRepository;
  }

  console.warn("[repository] Utilisation du repository MEMOIRE (pas Supabase).");
  return memoryRepository;
}
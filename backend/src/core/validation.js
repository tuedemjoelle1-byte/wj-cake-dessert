export function requireFields(input, fields) {
  const missing = fields.filter((field) => {
    const value = input[field];
    return value === undefined || value === null || value === "";
  });

  if (missing.length > 0) {
    const error = new Error("Des champs obligatoires sont manquants.");
    error.status = 400;
    error.code = "ERREUR_VALIDATION";
    error.details = { missing };
    throw error;
  }
}

export function asRouteError(res, error) {
  return {
    status: error.status || 500,
    code: error.code || "ERREUR_INTERNE",
    message: error.message || "Une erreur inattendue est survenue.",
    details: error.details || null
  };
}

import { getRepository } from "../../data/store.js";

const repository = getRepository();

export function createQuoteRequest(input) {
  return repository.createCustomCakeRequest({
    customerName: input.customerName,
    email: input.email,
    phone: input.phone,
    eventDate: input.eventDate,
    servings: Number(input.servings || 0),
    style: input.style || "custom",
    flavors: input.flavors || [],
    messageOnCake: input.messageOnCake || "",
    notes: input.notes || "",
    status: "en-attente",
    estimatedPrice: estimatePrice(input)
  });
}

function estimatePrice(input) {
  const servings = Number(input.servings || 0);
  const base = servings > 0 ? servings * 22 : 250;
  const flavorExtra = Array.isArray(input.flavors) ? input.flavors.length * 10 : 0;
  return {
    amount: base + flavorExtra,
    currency: "MAD",
    disclaimer: "Estimation indicative avant validation finale par la patissiere."
  };
}

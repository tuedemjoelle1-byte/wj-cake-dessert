import { getRepository } from "../../data/store.js";
import { getProductBySlug } from "../catalog/service.js";

const repository = getRepository();

async function resolveItems(inputItems = []) {
  return Promise.all(
    inputItems.map(async (item) => {
      const product = await getProductBySlug(item.productSlug);
      if (!product) {
        const error = new Error(`Produit inconnu : ${item.productSlug}`);
        error.status = 404;
        error.code = "PRODUIT_INTROUVABLE";
        throw error;
      }

      const quantity = Number(item.quantity || 1);
      return repository.normalizeCartItem(product, quantity);
    })
  );
}

export async function createCart(input) {
  const items = await resolveItems(input.items || []);
  return repository.createCart({
    customerEmail: input.customerEmail || null,
    items
  });
}

export async function updateCart(cartId, input) {
  const existingCart = await repository.getCartById(cartId);
  if (!existingCart) {
    const error = new Error("Panier introuvable.");
    error.status = 404;
    error.code = "PANIER_INTROUVABLE";
    throw error;
  }

  const items = Array.isArray(input.items) ? await resolveItems(input.items) : existingCart.items;
  return repository.updateCart(cartId, items);
}

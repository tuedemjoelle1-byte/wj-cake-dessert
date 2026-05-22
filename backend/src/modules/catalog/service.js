import { getRepository } from "../../data/store.js";

const repository = getRepository();

export function listCategories() {
  return repository.listCategories();
}

export function listProducts(filters = {}) {
  return repository.listProducts(filters);
}

export function getProductBySlug(slug) {
  return repository.getProductBySlug(slug);
}

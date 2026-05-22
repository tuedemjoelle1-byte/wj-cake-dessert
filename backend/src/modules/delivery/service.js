import { getRepository } from "../../data/store.js";

const repository = getRepository();

export function listDeliveryZones() {
  return repository.listDeliveryZones();
}

export function listDeliverySlots(filters = {}) {
  return repository.listDeliverySlots(filters);
}

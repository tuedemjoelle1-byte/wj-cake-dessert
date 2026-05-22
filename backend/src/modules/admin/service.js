import { getRepository } from "../../data/store.js";

const repository = getRepository();

export function getDashboard() {
  return repository.getAdminDashboard();
}

import { getRepository } from "../../data/store.js";
import { timestamp } from "../../lib/ids.js";

const repository = getRepository();

export async function audit(payload) {
  return repository.createAuditLog({
    action: payload.action,
    actorType: payload.actorType || "system",
    actorId: payload.actorId || null,
    targetType: payload.targetType || null,
    targetId: payload.targetId || null,
    metadata: payload.metadata || {},
    createdAt: timestamp()
  });
}

export function listAuditLogs() {
  return repository.listAuditLogs();
}

import { getRepository } from "../../data/store.js";
import { timestamp } from "../../lib/ids.js";

const repository = getRepository();

export async function notify(payload) {
  return repository.createNotification({
    type: payload.type,
    channel: payload.channel || "email",
    recipient: payload.recipient,
    subject: payload.subject,
    content: payload.content,
    status: "simule",
    metadata: payload.metadata || {},
    createdAt: timestamp()
  });
}

export function listNotifications() {
  return repository.listNotifications();
}

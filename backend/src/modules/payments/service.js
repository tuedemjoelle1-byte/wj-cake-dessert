import { getRepository } from "../../data/store.js";
import { createPublicId, timestamp } from "../../lib/ids.js";
import { getOrderByNumber } from "../orders/service.js";

const repository = getRepository();

export async function createPaymentIntent(input) {
  const order = await getOrderByNumber(input.orderNumber);
  if (!order) {
    const error = new Error("Commande introuvable.");
    error.status = 404;
    error.code = "COMMANDE_INTROUVABLE";
    throw error;
  }

  const payment = {
    id: createPublicId("pay"),
    orderNumber: order.number,
    provider: input.provider || "demo-cmi",
    status: "en-attente",
    amount: order.totals.total,
    currency: order.totals.currency,
    redirectUrl: `${input.returnUrl || "http://localhost:4000"}/payment/${order.number}`,
    createdAt: timestamp()
  };

  return repository.createPayment(payment);
}

export function listPayments() {
  return repository.listPayments();
}

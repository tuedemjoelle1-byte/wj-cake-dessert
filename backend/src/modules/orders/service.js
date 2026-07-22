import { getRepository } from "../../data/store.js";
import { createPublicId, timestamp } from "../../lib/ids.js";

const repository = getRepository();

function toOrderNumber() {
  return `CMD-${Date.now()}`;
}

function computeTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryFee = subtotal >= 400 ? 0 : subtotal > 0 ? 40 : 0;
  return {
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    currency: "DZD"
  };
}

function buildDirectItems(input) {
  if (Array.isArray(input.items) && input.items.length > 0) {
    return input.items.map((item) => {
      const quantity = Number(item.quantity) || 1;
      const unitPrice = Number(item.unitPrice) || 0;
      return {
        productId: item.productId || null,
        productSlug: item.productSlug || null,
        name: item.name || "Article personnalise",
        quantity,
        unitPrice,
        lineTotal: unitPrice * quantity
      };
    });
  }

  return [
    {
      productId: null,
      productSlug: null,
      name: input.label || "Demande via WhatsApp",
      quantity: 1,
      unitPrice: 0,
      lineTotal: 0
    }
  ];
}

function buildNotes(input) {
  const parts = [];
  if (input.phone) {
    parts.push(`Telephone : ${input.phone}`);
  }
  if (input.notes) {
    parts.push(input.notes);
  }
  return parts.length > 0 ? parts.join(" | ") : null;
}

export async function createOrder(input) {
  if (input.cartId) {
    const cart = await repository.getCartById(input.cartId);
    if (!cart) {
      const error = new Error("Panier introuvable.");
      error.status = 404;
      error.code = "PANIER_INTROUVABLE";
      throw error;
    }

    const order = {
      id: createPublicId("ord"),
      number: toOrderNumber(),
      cartId: cart.id,
      customerEmail: input.customerEmail || cart.customerEmail || null,
      customerName: input.customerName || null,
      fulfillmentMode: input.fulfillmentMode || "delivery",
      deliveryAddress: input.deliveryAddress || null,
      slotId: input.slotId || null,
      status: "en-attente",
      paymentStatus: "a-payer",
      items: cart.items,
      totals: cart.totals,
      source: input.source || "site",
      notes: buildNotes(input),
      createdAt: timestamp()
    };

    return repository.createOrder(order);
  }

  const items = buildDirectItems(input);
  const totals = computeTotals(items);

  const order = {
    id: createPublicId("ord"),
    number: toOrderNumber(),
    cartId: null,
    customerEmail: input.customerEmail || null,
    customerName: input.customerName || input.phone || "Client WhatsApp",
    fulfillmentMode: input.fulfillmentMode || "a-definir",
    deliveryAddress: input.deliveryAddress || null,
    slotId: input.slotId || null,
    status: "en-attente",
    paymentStatus: "a-payer",
    items,
    totals,
    source: input.source || "whatsapp",
    notes: buildNotes(input),
    createdAt: timestamp()
  };

  return repository.createOrder(order);
}

export function listOrders() {
  return repository.listOrders();
}

export function getOrderByNumber(number) {
  return repository.getOrderByNumber(number);
}
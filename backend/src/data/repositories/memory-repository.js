import { createPublicId, timestamp } from "../../lib/ids.js";
import { memoryDb } from "../memory-store.js";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function computeCartTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryFee = subtotal >= 400 ? 0 : 40;
  return {
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    currency: "MAD"
  };
}

function normalizeCartItem(product, quantity) {
  return {
    productId: product.id,
    productSlug: product.slug,
    name: product.name,
    quantity,
    unitPrice: product.basePrice,
    lineTotal: product.basePrice * quantity
  };
}

export const memoryRepository = {
  async findUserByEmail(email) {
    return clone(memoryDb.users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null);
  },

  async createUser(input) {
    const user = {
      id: createPublicId("cus"),
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
      emailVerified: false,
      addresses: [],
      preferences: {
        newsletter: false,
        transactionalEmails: true
      }
    };
    memoryDb.users.push(user);
    return clone(user);
  },

  async createSession(userId) {
    const session = {
      id: createPublicId("sess"),
      accessToken: `access_${userId}_${Date.now()}`,
      refreshToken: `refresh_${userId}_${Date.now()}`,
      userId,
      createdAt: timestamp()
    };
    memoryDb.sessions.push(session);
    return clone(session);
  },

  async listCategories() {
    return clone(memoryDb.categories);
  },

  async listProducts(filters = {}) {
    let products = [...memoryDb.products];

    if (filters.category) {
      products = products.filter((product) => product.categorySlug === filters.category);
    }

    if (filters.q) {
      const term = filters.q.toLowerCase();
      products = products.filter((product) => {
        return (
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.flavors.some((flavor) => flavor.toLowerCase().includes(term))
        );
      });
    }

    return clone(products);
  },

  async getProductBySlug(slug) {
    return clone(memoryDb.products.find((product) => product.slug === slug) || null);
  },

  async createCart(input) {
    const cart = {
      id: createPublicId("cart"),
      customerEmail: input.customerEmail || null,
      items: input.items,
      createdAt: timestamp(),
      updatedAt: timestamp()
    };
    cart.totals = computeCartTotals(cart.items);
    memoryDb.carts.push(cart);
    return clone(cart);
  },

  async updateCart(cartId, items) {
    const cart = memoryDb.carts.find((item) => item.id === cartId);
    if (!cart) {
      return null;
    }
    cart.items = items;
    cart.updatedAt = timestamp();
    cart.totals = computeCartTotals(items);
    return clone(cart);
  },

  async getCartById(cartId) {
    return clone(memoryDb.carts.find((item) => item.id === cartId) || null);
  },

  async getUserById(userId) {
    return clone(memoryDb.users.find((user) => user.id === userId) || null);
  },

  async getSessionByAccessToken(accessToken) {
    return clone(memoryDb.sessions.find((session) => session.accessToken === accessToken) || null);
  },

  async updateUser(userId, patch) {
    const user = memoryDb.users.find((item) => item.id === userId);
    if (!user) {
      return null;
    }

    Object.assign(user, patch);
    return clone(user);
  },

  async createPasswordResetToken(payload) {
    const record = {
      id: createPublicId("reset"),
      ...payload
    };
    memoryDb.passwordResetTokens.push(record);
    return clone(record);
  },

  async getPasswordResetToken(token) {
    return clone(memoryDb.passwordResetTokens.find((item) => item.token === token) || null);
  },

  async markPasswordResetTokenUsed(token) {
    const record = memoryDb.passwordResetTokens.find((item) => item.token === token);
    if (!record) {
      return null;
    }

    record.usedAt = timestamp();
    return clone(record);
  },

  async createNotification(payload) {
    const notification = {
      id: createPublicId("notif"),
      ...payload
    };
    memoryDb.notifications.push(notification);
    return clone(notification);
  },

  async listNotifications() {
    return clone(memoryDb.notifications);
  },

  async createAuditLog(payload) {
    const log = {
      id: createPublicId("audit"),
      ...payload
    };
    memoryDb.auditLogs.push(log);
    return clone(log);
  },

  async listAuditLogs() {
    return clone(memoryDb.auditLogs);
  },

  normalizeCartItem,

  async createCustomCakeRequest(payload) {
    const request = {
      id: createPublicId("quote"),
      ...payload,
      createdAt: timestamp()
    };
    memoryDb.customCakeRequests.push(request);
    return clone(request);
  },

  async createOrder(payload) {
    memoryDb.orders.push(payload);
    return clone(payload);
  },

  async listOrders() {
    return clone(memoryDb.orders);
  },

  async getOrderByNumber(number) {
    return clone(memoryDb.orders.find((order) => order.number === number) || null);
  },

  async createPayment(payload) {
    memoryDb.payments.push(payload);
    return clone(payload);
  },

  async listPayments() {
    return clone(memoryDb.payments);
  },

  async listDeliveryZones() {
    return clone(memoryDb.deliveryZones);
  },

  async listDeliverySlots(filters = {}) {
    let slots = [...memoryDb.deliverySlots];

    if (filters.type) {
      slots = slots.filter((slot) => slot.type === filters.type);
    }

    if (filters.date) {
      slots = slots.filter((slot) => slot.date === filters.date);
    }

    return clone(slots);
  },

  async getAdminDashboard() {
    const revenue = memoryDb.orders.reduce((sum, order) => sum + (order.totals?.total || 0), 0);

    return clone({
      commandes: {
        total: memoryDb.orders.length,
        enAttente: memoryDb.orders.filter((order) => order.status === "en-attente").length
      },
      paiements: {
        total: memoryDb.payments.length,
        enAttente: memoryDb.payments.filter((payment) => payment.status === "en-attente").length
      },
      chiffreAffaires: {
        total: revenue,
        currency: "MAD"
      }
    });
  }
};

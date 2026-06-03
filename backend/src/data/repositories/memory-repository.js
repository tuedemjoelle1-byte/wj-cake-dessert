import { createPublicId, timestamp } from "../../lib/ids.js";
import { memoryDb } from "../memory-store.js";
import { createSessionTokens, decodeSessionToken } from "../../lib/session-tokens.js";

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
    currency: "DZD"
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

function toDashboardRecentOrder(order) {
  return {
    id: order.id,
    number: order.number,
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    status: order.status,
    paymentStatus: order.paymentStatus,
    fulfillmentMode: order.fulfillmentMode,
    total: order.totals?.total || 0,
    currency: order.totals?.currency || "DZD",
    createdAt: order.createdAt
  };
}

function toAdminOrderItem(order) {
  return {
    id: order.id,
    number: order.number,
    status: order.status,
    paymentStatus: order.paymentStatus,
    fulfillmentMode: order.fulfillmentMode,
    customer: {
      name: order.customerName,
      email: order.customerEmail
    },
    total: order.totals?.total || 0,
    currency: order.totals?.currency || "DZD",
    createdAt: order.createdAt
  };
}

function toAdminOrderDetail(order) {
  return {
    id: order.id,
    number: order.number,
    status: order.status,
    paymentStatus: order.paymentStatus,
    fulfillmentMode: order.fulfillmentMode,
    customer: {
      name: order.customerName,
      email: order.customerEmail
    },
    delivery: {
      address: order.deliveryAddress,
      slotId: order.slotId
    },
    items: order.items || [],
    totals: order.totals || {
      subtotal: 0,
      deliveryFee: 0,
      total: 0,
      currency: "DZD"
    },
    createdAt: order.createdAt
  };
}

function toAdminQuoteRequestItem(request) {
  return {
    id: request.id,
    status: request.status,
    customer: {
      name: request.customerName,
      email: request.email,
      phone: request.phone
    },
    eventDate: request.eventDate,
    servings: request.servings,
    estimatedPrice: request.estimatedPrice,
    createdAt: request.createdAt
  };
}

function toAdminQuoteRequestDetail(request) {
  return {
    id: request.id,
    status: request.status,
    customer: {
      name: request.customerName,
      email: request.email,
      phone: request.phone
    },
    eventDate: request.eventDate,
    servings: request.servings,
    style: request.style,
    flavors: request.flavors || [],
    messageOnCake: request.messageOnCake,
    notes: request.notes,
    estimatedPrice: request.estimatedPrice,
    createdAt: request.createdAt
  };
}

function toAdminPaymentItem(payment) {
  return {
    id: payment.id,
    orderNumber: payment.orderNumber,
    provider: payment.provider,
    status: payment.status,
    amount: payment.amount,
    currency: payment.currency,
    createdAt: payment.createdAt
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
    const session = createSessionTokens(userId);
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
    return (
      clone(memoryDb.sessions.find((session) => session.accessToken === accessToken) || null) ||
      decodeSessionToken(accessToken)
    );
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

  async listAdminOrders(filters = {}) {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;

    let orders = [...memoryDb.orders];

    if (filters.status) {
      orders = orders.filter((order) => order.status === filters.status);
    }

    if (filters.email) {
      const emailTerm = filters.email.toLowerCase();
      orders = orders.filter((order) => (order.customerEmail || "").toLowerCase().includes(emailTerm));
    }

    if (filters.fulfillmentMode) {
      orders = orders.filter((order) => order.fulfillmentMode === filters.fulfillmentMode);
    }

    if (filters.date) {
      orders = orders.filter((order) => String(order.createdAt || "").slice(0, 10) === filters.date);
    }

    orders.sort((left, right) => new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime());

    const totalItems = orders.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const start = (page - 1) * pageSize;
    const items = orders.slice(start, start + pageSize).map(toAdminOrderItem);

    return clone({
      items,
      meta: {
        page,
        pageSize,
        totalItems,
        totalPages
      }
    });
  },

  async getAdminOrderByNumber(number) {
    const order = memoryDb.orders.find((item) => item.number === number);
    return clone(order ? toAdminOrderDetail(order) : null);
  },

  async updateOrderStatus(number, status) {
    const order = memoryDb.orders.find((item) => item.number === number);
    if (!order) {
      return null;
    }

    order.status = status;
    return clone(order);
  },

  async listAdminQuoteRequests(filters = {}) {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;

    let requests = [...memoryDb.customCakeRequests];

    if (filters.status) {
      requests = requests.filter((request) => request.status === filters.status);
    }

    if (filters.email) {
      const emailTerm = filters.email.toLowerCase();
      requests = requests.filter((request) => (request.email || "").toLowerCase().includes(emailTerm));
    }

    if (filters.date) {
      requests = requests.filter((request) => String(request.createdAt || "").slice(0, 10) === filters.date);
    }

    requests.sort(
      (left, right) => new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime()
    );

    const totalItems = requests.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const start = (page - 1) * pageSize;

    return clone({
      items: requests.slice(start, start + pageSize).map(toAdminQuoteRequestItem),
      meta: {
        page,
        pageSize,
        totalItems,
        totalPages
      }
    });
  },

  async getAdminQuoteRequestById(id) {
    const request = memoryDb.customCakeRequests.find((item) => item.id === id);
    return clone(request ? toAdminQuoteRequestDetail(request) : null);
  },

  async updateQuoteRequestStatus(id, status) {
    const request = memoryDb.customCakeRequests.find((item) => item.id === id);
    if (!request) {
      return null;
    }

    request.status = status;
    return clone(request);
  },

  async listAdminPayments(filters = {}) {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;

    let payments = [...memoryDb.payments];

    if (filters.status) {
      payments = payments.filter((payment) => payment.status === filters.status);
    }

    if (filters.provider) {
      const providerTerm = filters.provider.toLowerCase();
      payments = payments.filter((payment) => (payment.provider || "").toLowerCase().includes(providerTerm));
    }

    if (filters.date) {
      payments = payments.filter((payment) => String(payment.createdAt || "").slice(0, 10) === filters.date);
    }

    payments.sort(
      (left, right) => new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime()
    );

    const totalItems = payments.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const start = (page - 1) * pageSize;

    return clone({
      items: payments.slice(start, start + pageSize).map(toAdminPaymentItem),
      meta: {
        page,
        pageSize,
        totalItems,
        totalPages
      }
    });
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
    const pendingQuotes = memoryDb.customCakeRequests.filter((request) => request.status === "en-attente").length;
    const recentOrders = [...memoryDb.orders]
      .sort((left, right) => new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime())
      .slice(0, 5)
      .map(toDashboardRecentOrder);

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
        currency: "DZD"
      },
      devis: {
        enAttente: pendingQuotes
      },
      dernieresCommandes: recentOrders
    });
  }
};

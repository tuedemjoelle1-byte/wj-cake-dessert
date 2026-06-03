import { env } from "../../config/env.js";
import { createPublicId, timestamp } from "../../lib/ids.js";
import { createSessionTokens, decodeSessionToken } from "../../lib/session-tokens.js";

function buildUrl(path) {
  return `${env.supabaseUrl}${path}`;
}

async function supabaseRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(buildUrl(path), {
      ...options,
      headers: {
        apikey: env.supabaseServiceRoleKey,
        Authorization: `Bearer ${env.supabaseServiceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
        ...(options.headers || {})
      }
    });
  } catch (error) {
    const networkError = new Error("fetch failed");
    networkError.status = 503;
    networkError.code = "SUPABASE_NETWORK_ERROR";
    networkError.cause = error;
    throw networkError;
  }

  if (!response.ok) {
    const text = await response.text();
    const error = new Error(`Erreur Supabase: ${response.status} ${text}`);
    error.status = 500;
    error.code = "SUPABASE_ERROR";
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function encode(value) {
  return encodeURIComponent(value);
}

function toPublicProduct(row) {
  return {
    id: row.id,
    slug: row.slug,
    categorySlug: row.category_slug,
    name: row.name,
    description: row.description,
    basePrice: row.base_price,
    currency: row.currency,
    flavors: row.flavors || [],
    servings: row.servings || [],
    minNoticeHours: row.min_notice_hours,
    isBestSeller: row.is_best_seller
  };
}

function toPublicUser(row) {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    passwordHash: row.password_hash,
    emailVerified: row.email_verified,
    addresses: row.addresses || [],
    preferences: row.preferences || {
      newsletter: false,
      transactionalEmails: true
    }
  };
}

function toPublicOrder(row) {
  return {
    id: row.id,
    number: row.number,
    cartId: row.cart_id,
    customerEmail: row.customer_email,
    customerName: row.customer_name,
    fulfillmentMode: row.fulfillment_mode,
    deliveryAddress: row.delivery_address,
    slotId: row.slot_id,
    status: row.status,
    paymentStatus: row.payment_status,
    items: row.items || [],
    totals: row.totals || null,
    createdAt: row.created_at
  };
}

function toPublicPayment(row) {
  return {
    id: row.id,
    orderNumber: row.order_number,
    provider: row.provider,
    status: row.status,
    amount: row.amount,
    currency: row.currency,
    redirectUrl: row.redirect_url,
    createdAt: row.created_at
  };
}

function toPublicCustomCakeRequest(row) {
  return {
    id: row.id,
    customerName: row.customer_name,
    email: row.email,
    phone: row.phone,
    eventDate: row.event_date,
    servings: row.servings,
    style: row.style,
    flavors: row.flavors || [],
    messageOnCake: row.message_on_cake,
    notes: row.notes,
    status: row.status,
    estimatedPrice: {
      amount: row.estimated_amount,
      currency: row.estimated_currency,
      disclaimer: row.estimated_disclaimer
    },
    createdAt: row.created_at
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

async function fetchCartItems(cartId) {
  const rows = await supabaseRequest(`/rest/v1/cart_items?cart_id=eq.${encode(cartId)}&select=*`);
  return rows.map((row) => ({
    productId: row.product_id,
    productSlug: row.product_slug,
    name: row.name,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    lineTotal: row.line_total
  }));
}

async function fetchCart(cartId) {
  const rows = await supabaseRequest(`/rest/v1/carts?id=eq.${encode(cartId)}&select=*`);
  const cart = rows[0];
  if (!cart) {
    return null;
  }
  const items = await fetchCartItems(cart.id);
  return {
    id: cart.id,
    customerEmail: cart.customer_email,
    items,
    createdAt: cart.created_at,
    updatedAt: cart.updated_at,
    totals: {
      subtotal: cart.subtotal,
      deliveryFee: cart.delivery_fee,
      total: cart.total,
      currency: cart.currency
    }
  };
}

export const supabaseRepository = {
  async findUserByEmail(email) {
    const rows = await supabaseRequest(`/rest/v1/app_users?email=eq.${encode(email.toLowerCase())}&select=*`);
    return rows[0] ? toPublicUser(rows[0]) : null;
  },

  async createUser(input) {
    const rows = await supabaseRequest("/rest/v1/app_users", {
      method: "POST",
      body: JSON.stringify([
        {
          id: createPublicId("cus"),
          first_name: input.firstName,
          last_name: input.lastName,
          email: input.email.toLowerCase(),
          password_hash: input.passwordHash,
          email_verified: false,
          addresses: [],
          preferences: {
            newsletter: false,
            transactionalEmails: true
          }
        }
      ])
    });
    return toPublicUser(rows[0]);
  },

  async createSession(userId) {
    return createSessionTokens(userId);
  },

  async getSessionByAccessToken(accessToken) {
    return decodeSessionToken(accessToken);
  },

  async getUserById(userId) {
    const rows = await supabaseRequest(`/rest/v1/app_users?id=eq.${encode(userId)}&select=*`);
    return rows[0] ? toPublicUser(rows[0]) : null;
  },

  async updateUser(userId, patch) {
    const payload = {};

    if (patch.firstName !== undefined) payload.first_name = patch.firstName;
    if (patch.lastName !== undefined) payload.last_name = patch.lastName;
    if (patch.passwordHash !== undefined) payload.password_hash = patch.passwordHash;
    if (patch.emailVerified !== undefined) payload.email_verified = patch.emailVerified;
    if (patch.addresses !== undefined) payload.addresses = patch.addresses;
    if (patch.preferences !== undefined) payload.preferences = patch.preferences;

    const rows = await supabaseRequest(`/rest/v1/app_users?id=eq.${encode(userId)}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });

    return rows[0] ? toPublicUser(rows[0]) : null;
  },

  async createPasswordResetToken(payload) {
    const rows = await supabaseRequest("/rest/v1/password_reset_tokens", {
      method: "POST",
      body: JSON.stringify([
        {
          id: createPublicId("reset"),
          user_id: payload.userId,
          email: payload.email,
          token: payload.token,
          expires_at: payload.expiresAt,
          created_at: payload.createdAt,
          used_at: null
        }
      ])
    });

    return {
      id: rows[0].id,
      userId: rows[0].user_id,
      email: rows[0].email,
      token: rows[0].token,
      expiresAt: rows[0].expires_at,
      createdAt: rows[0].created_at,
      usedAt: rows[0].used_at
    };
  },

  async getPasswordResetToken(token) {
    const rows = await supabaseRequest(`/rest/v1/password_reset_tokens?token=eq.${encode(token)}&select=*`);
    if (!rows[0]) {
      return null;
    }

    return {
      id: rows[0].id,
      userId: rows[0].user_id,
      email: rows[0].email,
      token: rows[0].token,
      expiresAt: rows[0].expires_at,
      createdAt: rows[0].created_at,
      usedAt: rows[0].used_at
    };
  },

  async markPasswordResetTokenUsed(token) {
    const rows = await supabaseRequest(`/rest/v1/password_reset_tokens?token=eq.${encode(token)}`, {
      method: "PATCH",
      body: JSON.stringify({
        used_at: timestamp()
      })
    });

    if (!rows[0]) {
      return null;
    }

    return {
      id: rows[0].id,
      userId: rows[0].user_id,
      email: rows[0].email,
      token: rows[0].token,
      expiresAt: rows[0].expires_at,
      createdAt: rows[0].created_at,
      usedAt: rows[0].used_at
    };
  },

  async listCategories() {
    const rows = await supabaseRequest("/rest/v1/categories?select=*&order=name.asc");
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name
    }));
  },

  async listProducts(filters = {}) {
    const params = ["select=*"];
    if (filters.category) {
      params.push(`category_slug=eq.${encode(filters.category)}`);
    }
    if (filters.q) {
      params.push(`or=(name.ilike.*${encode(filters.q)}*,description.ilike.*${encode(filters.q)}*)`);
    }
    params.push("order=name.asc");
    const rows = await supabaseRequest(`/rest/v1/products?${params.join("&")}`);
    return rows.map(toPublicProduct);
  },

  async getProductBySlug(slug) {
    const rows = await supabaseRequest(`/rest/v1/products?slug=eq.${encode(slug)}&select=*`);
    return rows[0] ? toPublicProduct(rows[0]) : null;
  },

  normalizeCartItem,

  async createCart(input) {
    const totals = computeCartTotals(input.items);
    const cartId = createPublicId("cart");
    const now = timestamp();

    const cartRows = await supabaseRequest("/rest/v1/carts", {
      method: "POST",
      body: JSON.stringify([
        {
          id: cartId,
          customer_email: input.customerEmail || null,
          subtotal: totals.subtotal,
          delivery_fee: totals.deliveryFee,
          total: totals.total,
          currency: totals.currency,
          created_at: now,
          updated_at: now
        }
      ])
    });

    await supabaseRequest("/rest/v1/cart_items", {
      method: "POST",
      body: JSON.stringify(
        input.items.map((item) => ({
          id: createPublicId("item"),
          cart_id: cartId,
          product_id: item.productId,
          product_slug: item.productSlug,
          name: item.name,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          line_total: item.lineTotal
        }))
      )
    });

    return {
      id: cartRows[0].id,
      customerEmail: cartRows[0].customer_email,
      items: input.items,
      createdAt: cartRows[0].created_at,
      updatedAt: cartRows[0].updated_at,
      totals
    };
  },

  async updateCart(cartId, items) {
    const existing = await fetchCart(cartId);
    if (!existing) {
      return null;
    }

    const totals = computeCartTotals(items);

    await supabaseRequest(`/rest/v1/cart_items?cart_id=eq.${encode(cartId)}`, {
      method: "DELETE",
      headers: { Prefer: "return=minimal" }
    });

    await supabaseRequest("/rest/v1/cart_items", {
      method: "POST",
      body: JSON.stringify(
        items.map((item) => ({
          id: createPublicId("item"),
          cart_id: cartId,
          product_id: item.productId,
          product_slug: item.productSlug,
          name: item.name,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          line_total: item.lineTotal
        }))
      )
    });

    await supabaseRequest(`/rest/v1/carts?id=eq.${encode(cartId)}`, {
      method: "PATCH",
      body: JSON.stringify({
        subtotal: totals.subtotal,
        delivery_fee: totals.deliveryFee,
        total: totals.total,
        updated_at: timestamp()
      })
    });

    return fetchCart(cartId);
  },

  async getCartById(cartId) {
    return fetchCart(cartId);
  },

  async createCustomCakeRequest(payload) {
    const rows = await supabaseRequest("/rest/v1/custom_cake_requests", {
      method: "POST",
      body: JSON.stringify([
        {
          id: createPublicId("quote"),
          customer_name: payload.customerName,
          email: payload.email,
          phone: payload.phone,
          event_date: payload.eventDate,
          servings: payload.servings,
          style: payload.style,
          flavors: payload.flavors,
          message_on_cake: payload.messageOnCake,
          notes: payload.notes,
          status: payload.status,
          estimated_amount: payload.estimatedPrice.amount,
          estimated_currency: payload.estimatedPrice.currency,
          estimated_disclaimer: payload.estimatedPrice.disclaimer,
          created_at: timestamp()
        }
      ])
    });

    return toPublicCustomCakeRequest(rows[0]);
  },

  async listCustomCakeRequests() {
    const rows = await supabaseRequest("/rest/v1/custom_cake_requests?select=*&order=created_at.desc");
    return rows.map(toPublicCustomCakeRequest);
  },

  async createNotification(payload) {
    const rows = await supabaseRequest("/rest/v1.notifications", {
      method: "POST",
      body: JSON.stringify([
        {
          id: createPublicId("notif"),
          type: payload.type,
          channel: payload.channel,
          recipient: payload.recipient,
          subject: payload.subject,
          content: payload.content,
          status: payload.status,
          metadata: payload.metadata || {},
          created_at: payload.createdAt
        }
      ])
    });

    return {
      id: rows[0].id,
      type: rows[0].type,
      channel: rows[0].channel,
      recipient: rows[0].recipient,
      subject: rows[0].subject,
      content: rows[0].content,
      status: rows[0].status,
      metadata: rows[0].metadata,
      createdAt: rows[0].created_at
    };
  },

  async listNotifications() {
    const rows = await supabaseRequest("/rest/v1/notifications?select=*&order=created_at.desc");
    return rows.map((row) => ({
      id: row.id,
      type: row.type,
      channel: row.channel,
      recipient: row.recipient,
      subject: row.subject,
      content: row.content,
      status: row.status,
      metadata: row.metadata || {},
      createdAt: row.created_at
    }));
  },

  async createAuditLog(payload) {
    const rows = await supabaseRequest("/rest/v1/audit_logs", {
      method: "POST",
      body: JSON.stringify([
        {
          id: createPublicId("audit"),
          action: payload.action,
          actor_type: payload.actorType,
          actor_id: payload.actorId,
          target_type: payload.targetType,
          target_id: payload.targetId,
          metadata: payload.metadata || {},
          created_at: payload.createdAt
        }
      ])
    });

    return {
      id: rows[0].id,
      action: rows[0].action,
      actorType: rows[0].actor_type,
      actorId: rows[0].actor_id,
      targetType: rows[0].target_type,
      targetId: rows[0].target_id,
      metadata: rows[0].metadata || {},
      createdAt: rows[0].created_at
    };
  },

  async listAuditLogs() {
    const rows = await supabaseRequest("/rest/v1/audit_logs?select=*&order=created_at.desc");
    return rows.map((row) => ({
      id: row.id,
      action: row.action,
      actorType: row.actor_type,
      actorId: row.actor_id,
      targetType: row.target_type,
      targetId: row.target_id,
      metadata: row.metadata || {},
      createdAt: row.created_at
    }));
  },

  async createOrder(payload) {
    const rows = await supabaseRequest("/rest/v1/orders", {
      method: "POST",
      body: JSON.stringify([
        {
          id: payload.id,
          number: payload.number,
          cart_id: payload.cartId,
          customer_email: payload.customerEmail,
          customer_name: payload.customerName,
          fulfillment_mode: payload.fulfillmentMode,
          delivery_address: payload.deliveryAddress,
          slot_id: payload.slotId,
          status: payload.status,
          payment_status: payload.paymentStatus,
          items: payload.items,
          totals: payload.totals,
          created_at: payload.createdAt
        }
      ])
    });
    return toPublicOrder(rows[0]);
  },

  async listOrders() {
    const rows = await supabaseRequest("/rest/v1/orders?select=*&order=created_at.desc");
    return rows.map(toPublicOrder);
  },

  async getOrderByNumber(number) {
    const rows = await supabaseRequest(`/rest/v1/orders?number=eq.${encode(number)}&select=*`);
    return rows[0] ? toPublicOrder(rows[0]) : null;
  },

  async listAdminOrders(filters = {}) {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    let orders = await this.listOrders();

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

    const totalItems = orders.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const start = (page - 1) * pageSize;

    return {
      items: orders.slice(start, start + pageSize).map(toAdminOrderItem),
      meta: {
        page,
        pageSize,
        totalItems,
        totalPages
      }
    };
  },

  async getAdminOrderByNumber(number) {
    const order = await this.getOrderByNumber(number);
    return order ? toAdminOrderDetail(order) : null;
  },

  async updateOrderStatus(number, status) {
    const rows = await supabaseRequest(`/rest/v1/orders?number=eq.${encode(number)}`, {
      method: "PATCH",
      body: JSON.stringify({
        status
      })
    });

    return rows[0] ? toPublicOrder(rows[0]) : null;
  },

  async listAdminQuoteRequests(filters = {}) {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    let requests = await this.listCustomCakeRequests();

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

    const totalItems = requests.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const start = (page - 1) * pageSize;

    return {
      items: requests.slice(start, start + pageSize).map(toAdminQuoteRequestItem),
      meta: {
        page,
        pageSize,
        totalItems,
        totalPages
      }
    };
  },

  async getAdminQuoteRequestById(id) {
    const rows = await supabaseRequest(`/rest/v1/custom_cake_requests?id=eq.${encode(id)}&select=*`);
    return rows[0] ? toAdminQuoteRequestDetail(toPublicCustomCakeRequest(rows[0])) : null;
  },

  async updateQuoteRequestStatus(id, status) {
    const rows = await supabaseRequest(`/rest/v1/custom_cake_requests?id=eq.${encode(id)}`, {
      method: "PATCH",
      body: JSON.stringify({
        status
      })
    });

    return rows[0] ? toPublicCustomCakeRequest(rows[0]) : null;
  },

  async listAdminPayments(filters = {}) {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    let payments = await this.listPayments();

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

    const totalItems = payments.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const start = (page - 1) * pageSize;

    return {
      items: payments.slice(start, start + pageSize).map(toAdminPaymentItem),
      meta: {
        page,
        pageSize,
        totalItems,
        totalPages
      }
    };
  },

  async createPayment(payload) {
    const rows = await supabaseRequest("/rest/v1/payments", {
      method: "POST",
      body: JSON.stringify([
        {
          id: payload.id,
          order_number: payload.orderNumber,
          provider: payload.provider,
          status: payload.status,
          amount: payload.amount,
          currency: payload.currency,
          redirect_url: payload.redirectUrl,
          created_at: payload.createdAt
        }
      ])
    });
    return toPublicPayment(rows[0]);
  },

  async listPayments() {
    const rows = await supabaseRequest("/rest/v1/payments?select=*&order=created_at.desc");
    return rows.map(toPublicPayment);
  },

  async listDeliveryZones() {
    const rows = await supabaseRequest("/rest/v1/delivery_zones?select=*&order=name.asc");
    return rows.map((row) => ({
      id: row.id,
      code: row.code,
      name: row.name,
      fee: row.fee,
      currency: row.currency,
      active: row.active
    }));
  },

  async listDeliverySlots(filters = {}) {
    const params = ["select=*"];
    if (filters.type) {
      params.push(`type=eq.${encode(filters.type)}`);
    }
    if (filters.date) {
      params.push(`date=eq.${encode(filters.date)}`);
    }
    params.push("order=date.asc,start_time.asc");
    const rows = await supabaseRequest(`/rest/v1/delivery_slots?${params.join("&")}`);
    return rows.map((row) => ({
      id: row.id,
      date: row.date,
      startTime: row.start_time,
      endTime: row.end_time,
      type: row.type,
      available: row.available
    }));
  },

  async getAdminDashboard() {
    const [orders, payments, quoteRequests] = await Promise.all([
      this.listOrders(),
      this.listPayments(),
      this.listCustomCakeRequests()
    ]);
    const revenue = orders.reduce((sum, order) => sum + (order.totals?.total || 0), 0);

    return {
      commandes: {
        total: orders.length,
        enAttente: orders.filter((order) => order.status === "en-attente").length
      },
      paiements: {
        total: payments.length,
        enAttente: payments.filter((payment) => payment.status === "en-attente").length
      },
      chiffreAffaires: {
        total: revenue,
        currency: "DZD"
      },
      devis: {
        enAttente: quoteRequests.filter((request) => request.status === "en-attente").length
      },
      dernieresCommandes: orders.slice(0, 5).map(toDashboardRecentOrder)
    };
  }
};

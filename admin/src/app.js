const currencyFormatter = new Intl.NumberFormat("fr-DZ");
const tokenStorageKey = "wj_admin_token";
let adminToken = localStorage.getItem(tokenStorageKey) || "";

const elements = {
  loginShell: document.querySelector("#admin-login-shell"),
  loginForm: document.querySelector("#admin-login-form"),
  loginEmail: document.querySelector("#admin-email"),
  loginPassword: document.querySelector("#admin-password"),
  loginSubmit: document.querySelector("#admin-login-submit"),
  loginFeedback: document.querySelector("#admin-login-feedback"),
  logoutButton: document.querySelector("#admin-logout"),
  apiStatus: document.querySelector("#api-status"),
  kpiGrid: document.querySelector("#kpi-grid"),
  salesChart: document.querySelector("#sales-chart"),
  topProductsChart: document.querySelector("#top-products-chart"),
  popularProducts: document.querySelector("#popular-products"),
  ordersTable: document.querySelector("#orders-table"),
  ordersCount: document.querySelector("#orders-count"),
  quotesTable: document.querySelector("#quotes-table"),
  quotesCount: document.querySelector("#quotes-count"),
  paymentsTable: document.querySelector("#payments-table"),
  paymentsCount: document.querySelector("#payments-count"),
  systemState: document.querySelector("#system-state"),
  ordersFilters: document.querySelector("#orders-filters"),
  filterEmail: document.querySelector("#filter-email"),
  filterStatus: document.querySelector("#filter-status"),
  filterFulfillment: document.querySelector("#filter-fulfillment"),
  prevPage: document.querySelector("#prev-page"),
  nextPage: document.querySelector("#next-page"),
  paginationState: document.querySelector("#pagination-state"),
  quotesFilters: document.querySelector("#quotes-filters"),
  quoteFilterEmail: document.querySelector("#quote-filter-email"),
  quoteFilterStatus: document.querySelector("#quote-filter-status"),
  quotesPrevPage: document.querySelector("#quotes-prev-page"),
  quotesNextPage: document.querySelector("#quotes-next-page"),
  quotesPaginationState: document.querySelector("#quotes-pagination-state"),
  paymentsFilters: document.querySelector("#payments-filters"),
  paymentFilterProvider: document.querySelector("#payment-filter-provider"),
  paymentFilterStatus: document.querySelector("#payment-filter-status"),
  paymentsPrevPage: document.querySelector("#payments-prev-page"),
  paymentsNextPage: document.querySelector("#payments-next-page"),
  paymentsPaginationState: document.querySelector("#payments-pagination-state"),
  detailTitle: document.querySelector("#detail-title"),
  detailStatus: document.querySelector("#detail-status"),
  orderDetail: document.querySelector("#order-detail"),
  statusForm: document.querySelector("#status-form"),
  statusSelect: document.querySelector("#status-select"),
  statusSubmit: document.querySelector("#status-submit"),
  quoteDetailTitle: document.querySelector("#quote-detail-title"),
  quoteDetailStatus: document.querySelector("#quote-detail-status"),
  quoteDetail: document.querySelector("#quote-detail"),
  quoteStatusForm: document.querySelector("#quote-status-form"),
  quoteStatusSelect: document.querySelector("#quote-status-select"),
  quoteStatusSubmit: document.querySelector("#quote-status-submit")
};

const orderState = {
  page: 1,
  pageSize: 8,
  totalPages: 1,
  currentOrderNumber: "",
  filters: {
    email: "",
    status: "",
    fulfillmentMode: ""
  }
};

const quoteState = {
  page: 1,
  pageSize: 6,
  totalPages: 1,
  currentQuoteId: "",
  filters: {
    email: "",
    status: ""
  }
};

const paymentState = {
  page: 1,
  pageSize: 6,
  totalPages: 1,
  filters: {
    provider: "",
    status: ""
  }
};

const kpiMedia = {
  revenue: {
    image:
      "https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=900&q=80",
    alt: "Pâtisseries haut de gamme dressées sur un comptoir",
    mediaClass: "revenue"
  },
  orders: {
    image:
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=900&q=80",
    alt: "Assortiment de gâteaux et cupcakes prêts à partir",
    mediaClass: "orders"
  },
  customers: {
    image:
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=900&q=80",
    alt: "Clientèle réunie autour d'une table dessert",
    mediaClass: "customers"
  },
  products: {
    image:
      "https://images.unsplash.com/photo-1559622214-f8a9850965bb?auto=format&fit=crop&w=900&q=80",
    alt: "Vitrine de créations sucrées et entremets",
    mediaClass: "products"
  }
};

boot().catch((error) => {
  elements.apiStatus.textContent = "Backend indisponible";
  elements.systemState.textContent = error.message;
  renderKpis(null);
  renderOrders([]);
  renderQuotes([]);
  renderPayments([]);
});

async function boot() {
  bindEvents();

  if (!(await restoreAdminSession())) {
    showLogin();
    return;
  }

  await loadAdminApp();
}

function renderKpis(dashboard) {
  if (!dashboard) {
    elements.kpiGrid.innerHTML = [
      { label: "Chiffre d'affaires", value: "--", note: "Données en attente", iconClass: "pink", badgeClass: "neutral", ...kpiMedia.revenue },
      { label: "Commandes", value: "--", note: "Données en attente", iconClass: "orange", badgeClass: "neutral", ...kpiMedia.orders },
      { label: "Clients", value: "--", note: "Données en attente", iconClass: "green", badgeClass: "neutral", ...kpiMedia.customers },
      { label: "Produits", value: "--", note: "Données en attente", iconClass: "purple", badgeClass: "neutral", ...kpiMedia.products }
    ]
      .map(renderKpiCard)
      .join("");
    elements.salesChart.innerHTML = renderEmptyChart();
    elements.topProductsChart.innerHTML = renderEmptyDonut();
    elements.popularProducts.innerHTML = `<p class="empty-detail">Aucune statistique disponible.</p>`;
    return;
  }

  const analytics = deriveAnalytics(dashboard);
  const cards = [
    {
      label: "Chiffre d'affaires",
      value: `${currencyFormatter.format(dashboard.chiffreAffaires.total)} ${dashboard.chiffreAffaires.currency}`,
      note: `${dashboard.commandes.total} commandes cumulées`,
      iconClass: "pink",
      badgeClass: "up",
      ...kpiMedia.revenue
    },
    {
      label: "Commandes",
      value: String(dashboard.commandes.total),
      note: `${dashboard.commandes.enAttente} en attente`,
      iconClass: "orange",
      badgeClass: "neutral",
      ...kpiMedia.orders
    },
    {
      label: "Clients",
      value: String(analytics.uniqueCustomers),
      note: `${dashboard.devis.enAttente} devis à traiter`,
      iconClass: "green",
      badgeClass: "up",
      ...kpiMedia.customers
    },
    {
      label: "Produits",
      value: String(analytics.productCount),
      note: `${dashboard.paiements.enAttente} paiements en attente`,
      iconClass: "purple",
      badgeClass: "warn",
      ...kpiMedia.products
    }
  ];

  elements.kpiGrid.innerHTML = cards.map(renderKpiCard).join("");

  elements.salesChart.innerHTML = renderSalesChart(analytics.salesSeries, dashboard.chiffreAffaires.currency);
  elements.topProductsChart.innerHTML = renderTopProducts(analytics.topProducts);
  elements.popularProducts.innerHTML = renderPopularProducts(analytics.topProducts, dashboard.chiffreAffaires.currency);
}

function renderOrders(orders) {
  elements.ordersCount.textContent = `${orders.length} élément${orders.length > 1 ? "s" : ""}`;

  if (orders.length === 0) {
    elements.ordersTable.innerHTML = `
      <div class="empty-state">
        <p>Aucune commande récente pour le moment.</p>
      </div>
    `;
    return;
  }

  elements.ordersTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>N° commande</th>
          <th>Client</th>
          <th>Produit</th>
          <th>Montant</th>
          <th>Statut</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${orders
          .slice(0, 5)
          .map(
            (order) => `
              <tr>
                <td>
                  <button class="link-button order-detail-trigger" data-order-number="${order.number}" type="button">
                    ${order.number}
                  </button>
                </td>
                <td>${order.customer?.name || order.customer?.email || "Client inconnu"}</td>
                <td>${order.items?.[0]?.name || "Commande personnalisée"}</td>
                <td>${currencyFormatter.format(order.total)} ${order.currency}</td>
                <td><span class="status-chip">${translateStatus(order.status)}</span></td>
                <td>${formatDate(order.createdAt)}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;

  for (const button of document.querySelectorAll(".order-detail-trigger")) {
    button.addEventListener("click", () => {
      void loadOrderDetail(button.dataset.orderNumber);
    });
  }
}

function renderQuotes(items) {
  elements.quotesCount.textContent = `${items.length} élément${items.length > 1 ? "s" : ""}`;

  if (items.length === 0) {
    elements.quotesTable.innerHTML = `
      <div class="empty-state">
        <p>Aucune demande de devis pour le moment.</p>
      </div>
    `;
    return;
  }

  elements.quotesTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Demande</th>
          <th>Client</th>
          <th>Statut</th>
          <th>Événement</th>
          <th>Portions</th>
          <th>Estimation</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .slice(0, 5)
          .map(
            (item) => `
              <tr>
                <td>
                  <button class="link-button quote-detail-trigger" data-quote-id="${item.id}" type="button">
                    ${item.id}
                  </button>
                  <small>${formatDate(item.createdAt)}</small>
                </td>
                <td>${item.customer?.name || item.customer?.email || "Client inconnu"}</td>
                <td><span class="status-chip">${translateStatus(item.status)}</span></td>
                <td>${item.eventDate || "Non renseignée"}</td>
                <td>${item.servings || 0}</td>
                <td>${currencyFormatter.format(item.estimatedPrice.amount)} ${item.estimatedPrice.currency}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;

  for (const button of document.querySelectorAll(".quote-detail-trigger")) {
    button.addEventListener("click", () => {
      void loadQuoteDetail(button.dataset.quoteId);
    });
  }
}

function renderPayments(items) {
  elements.paymentsCount.textContent = `${items.length} élément${items.length > 1 ? "s" : ""}`;

  if (items.length === 0) {
    elements.paymentsTable.innerHTML = `
      <div class="empty-state">
        <p>Aucun paiement pour le moment.</p>
      </div>
    `;
    return;
  }

  elements.paymentsTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Paiement</th>
          <th>Commande</th>
          <th>Provider</th>
          <th>Statut</th>
          <th>Montant</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .slice(0, 5)
          .map(
            (item) => `
              <tr>
                <td><strong>${item.id}</strong></td>
                <td>${item.orderNumber}</td>
                <td>${item.provider}</td>
                <td><span class="status-chip is-soft">${translateStatus(item.status)}</span></td>
                <td>${currencyFormatter.format(item.amount)} ${item.currency}</td>
                <td>${formatDate(item.createdAt)}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function bindEvents() {
  elements.loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    elements.loginSubmit.disabled = true;
    elements.loginFeedback.textContent = "Connexion admin en cours...";

    try {
      const payload = await fetchJson("/api/v1/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: elements.loginEmail.value.trim(),
          password: elements.loginPassword.value
        })
      });

      adminToken = payload.accessToken;
      localStorage.setItem(tokenStorageKey, adminToken);
      elements.loginPassword.value = "";
      hideLogin();
      await loadAdminApp();
    } catch (error) {
      elements.loginFeedback.textContent = error.message;
    } finally {
      elements.loginSubmit.disabled = false;
    }
  });

  elements.logoutButton.addEventListener("click", () => {
    adminToken = "";
    localStorage.removeItem(tokenStorageKey);
    elements.apiStatus.textContent = "Session admin fermée";
    showLogin();
  });

  elements.ordersFilters.addEventListener("submit", async (event) => {
    event.preventDefault();
    orderState.page = 1;
    orderState.filters.email = elements.filterEmail.value.trim();
    orderState.filters.status = elements.filterStatus.value;
    orderState.filters.fulfillmentMode = elements.filterFulfillment.value;
    await loadOrders();
  });

  elements.prevPage.addEventListener("click", async () => {
    if (orderState.page <= 1) {
      return;
    }

    orderState.page -= 1;
    await loadOrders();
  });

  elements.nextPage.addEventListener("click", async () => {
    if (orderState.page >= orderState.totalPages) {
      return;
    }

    orderState.page += 1;
    await loadOrders();
  });

  elements.quotesFilters.addEventListener("submit", async (event) => {
    event.preventDefault();
    quoteState.page = 1;
    quoteState.filters.email = elements.quoteFilterEmail.value.trim();
    quoteState.filters.status = elements.quoteFilterStatus.value;
    await loadQuotes();
  });

  elements.quotesPrevPage.addEventListener("click", async () => {
    if (quoteState.page <= 1) {
      return;
    }

    quoteState.page -= 1;
    await loadQuotes();
  });

  elements.quotesNextPage.addEventListener("click", async () => {
    if (quoteState.page >= quoteState.totalPages) {
      return;
    }

    quoteState.page += 1;
    await loadQuotes();
  });

  elements.paymentsFilters.addEventListener("submit", async (event) => {
    event.preventDefault();
    paymentState.page = 1;
    paymentState.filters.provider = elements.paymentFilterProvider.value.trim();
    paymentState.filters.status = elements.paymentFilterStatus.value;
    await loadPayments();
  });

  elements.paymentsPrevPage.addEventListener("click", async () => {
    if (paymentState.page <= 1) {
      return;
    }

    paymentState.page -= 1;
    await loadPayments();
  });

  elements.paymentsNextPage.addEventListener("click", async () => {
    if (paymentState.page >= paymentState.totalPages) {
      return;
    }

    paymentState.page += 1;
    await loadPayments();
  });

  elements.statusForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!orderState.currentOrderNumber) {
      elements.systemState.textContent = "Sélectionnez d'abord une commande.";
      return;
    }

    elements.statusSubmit.disabled = true;
    elements.systemState.textContent = "Mise à jour du statut en cours...";

    try {
      await fetchJson(`/api/v1/admin/orders/${encodeURIComponent(orderState.currentOrderNumber)}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status: elements.statusSelect.value
        })
      });

      await Promise.all([
        loadDashboard(),
        loadOrders(),
        loadOrderDetail(orderState.currentOrderNumber)
      ]);
      elements.systemState.textContent = "Statut mis à jour.";
    } finally {
      elements.statusSubmit.disabled = false;
    }
  });

  elements.quoteStatusForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!quoteState.currentQuoteId) {
      elements.systemState.textContent = "Sélectionnez d'abord un devis.";
      return;
    }

    elements.quoteStatusSubmit.disabled = true;
    elements.systemState.textContent = "Mise à jour du devis en cours...";

    try {
      await fetchJson(`/api/v1/admin/quote-requests/${encodeURIComponent(quoteState.currentQuoteId)}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status: elements.quoteStatusSelect.value
        })
      });

      await Promise.all([loadDashboard(), loadQuotes(), loadQuoteDetail(quoteState.currentQuoteId)]);
      elements.systemState.textContent = "Statut du devis mis à jour.";
    } finally {
      elements.quoteStatusSubmit.disabled = false;
    }
  });
}

async function loadDashboard() {
  const payload = await fetchJson("/api/v1/admin/dashboard");
  renderKpis(payload.item);
  return payload;
}

async function restoreAdminSession() {
  if (!adminToken) {
    return false;
  }

  try {
    await fetchJson("/api/v1/admin/me");
    hideLogin();
    return true;
  } catch {
    adminToken = "";
    localStorage.removeItem(tokenStorageKey);
    return false;
  }
}

async function loadAdminApp() {
  elements.systemState.textContent = "Chargement du tableau de bord...";
  await Promise.all([loadDashboard(), loadOrders(), loadQuotes(), loadPayments()]);
  elements.apiStatus.textContent = "Connecté au backend W.J. Cake & Dessert";
  elements.systemState.textContent = "Données synchronisées";
}

function showLogin() {
  document.body.classList.add("is-auth-locked");
  elements.loginShell.hidden = false;
  elements.loginFeedback.textContent = "Utilisez les identifiants admin du projet.";
}

function hideLogin() {
  document.body.classList.remove("is-auth-locked");
  elements.loginShell.hidden = true;
}

async function loadOrders() {
  const query = new URLSearchParams({
    page: String(orderState.page),
    pageSize: String(orderState.pageSize)
  });

  if (orderState.filters.email) {
    query.set("email", orderState.filters.email);
  }

  if (orderState.filters.status) {
    query.set("status", orderState.filters.status);
  }

  if (orderState.filters.fulfillmentMode) {
    query.set("fulfillmentMode", orderState.filters.fulfillmentMode);
  }

  const payload = await fetchJson(`/api/v1/admin/orders?${query.toString()}`);
  orderState.totalPages = payload.meta.totalPages || 1;
  renderOrders(payload.items || []);
  renderPagination(payload.meta);
  return payload;
}

async function loadQuotes() {
  const query = new URLSearchParams({
    page: String(quoteState.page),
    pageSize: String(quoteState.pageSize)
  });

  if (quoteState.filters.email) {
    query.set("email", quoteState.filters.email);
  }

  if (quoteState.filters.status) {
    query.set("status", quoteState.filters.status);
  }

  const payload = await fetchJson(`/api/v1/admin/quote-requests?${query.toString()}`);
  quoteState.totalPages = payload.meta.totalPages || 1;
  renderQuotes(payload.items || []);
  renderQuotesPagination(payload.meta);
  return payload;
}

async function loadPayments() {
  const query = new URLSearchParams({
    page: String(paymentState.page),
    pageSize: String(paymentState.pageSize)
  });

  if (paymentState.filters.provider) {
    query.set("provider", paymentState.filters.provider);
  }

  if (paymentState.filters.status) {
    query.set("status", paymentState.filters.status);
  }

  const payload = await fetchJson(`/api/v1/admin/payments?${query.toString()}`);
  paymentState.totalPages = payload.meta.totalPages || 1;
  renderPayments(payload.items || []);
  renderPaymentsPagination(payload.meta);
  return payload;
}

function renderPagination(meta = {}) {
  elements.paginationState.textContent = `Page ${meta.page || 1} / ${meta.totalPages || 1}`;
  elements.prevPage.disabled = (meta.page || 1) <= 1;
  elements.nextPage.disabled = (meta.page || 1) >= (meta.totalPages || 1);
}

function renderQuotesPagination(meta = {}) {
  elements.quotesPaginationState.textContent = `Page ${meta.page || 1} / ${meta.totalPages || 1}`;
  elements.quotesPrevPage.disabled = (meta.page || 1) <= 1;
  elements.quotesNextPage.disabled = (meta.page || 1) >= (meta.totalPages || 1);
}

function renderPaymentsPagination(meta = {}) {
  elements.paymentsPaginationState.textContent = `Page ${meta.page || 1} / ${meta.totalPages || 1}`;
  elements.paymentsPrevPage.disabled = (meta.page || 1) <= 1;
  elements.paymentsNextPage.disabled = (meta.page || 1) >= (meta.totalPages || 1);
}

async function loadOrderDetail(orderNumber) {
  orderState.currentOrderNumber = orderNumber;
  elements.detailTitle.textContent = `Commande ${orderNumber}`;
  elements.detailStatus.textContent = "Chargement...";
  elements.orderDetail.innerHTML = `<p class="empty-detail">Récupération des informations...</p>`;

  const payload = await fetchJson(`/api/v1/admin/orders/${encodeURIComponent(orderNumber)}`);
  const order = payload.item;

  elements.detailStatus.textContent = order.status;
  elements.statusSelect.value = order.status;
  elements.orderDetail.innerHTML = `
    <div class="detail-grid">
      <article>
        <h4>Client</h4>
        <p><strong>Nom :</strong> ${order.customer.name || "Non renseigné"}</p>
        <p><strong>Email :</strong> ${order.customer.email || "Non renseigné"}</p>
      </article>
      <article>
        <h4>Livraison</h4>
        <p><strong>Mode :</strong> ${order.fulfillmentMode}</p>
        <p><strong>Adresse :</strong> ${order.delivery.address || "Aucune adresse"}</p>
        <p><strong>Créneau :</strong> ${order.delivery.slotId || "Non renseigné"}</p>
      </article>
      <article>
        <h4>Paiement</h4>
        <p><strong>Statut :</strong> ${order.paymentStatus}</p>
        <p><strong>Total :</strong> ${currencyFormatter.format(order.totals.total)} ${order.totals.currency}</p>
        <p><strong>Date :</strong> ${formatDate(order.createdAt)}</p>
      </article>
    </div>
    <div class="detail-lines">
      <h4>Articles</h4>
      <ul>
        ${order.items
          .map(
            (item) => `
              <li>
                <strong>${item.name}</strong>
                <span>${item.quantity} x ${currencyFormatter.format(item.unitPrice)} ${order.totals.currency}</span>
              </li>
            `
          )
          .join("")}
      </ul>
    </div>
  `;
}

async function loadQuoteDetail(quoteId) {
  quoteState.currentQuoteId = quoteId;
  elements.quoteDetailTitle.textContent = `Devis ${quoteId}`;
  elements.quoteDetailStatus.textContent = "Chargement...";
  elements.quoteDetail.innerHTML = `<p class="empty-detail">Récupération des informations...</p>`;

  const payload = await fetchJson(`/api/v1/admin/quote-requests/${encodeURIComponent(quoteId)}`);
  const item = payload.item;

  elements.quoteDetailStatus.textContent = item.status;
  elements.quoteStatusSelect.value = item.status;
  elements.quoteDetail.innerHTML = `
    <div class="detail-grid">
      <article>
        <h4>Client</h4>
        <p><strong>Nom :</strong> ${item.customer.name || "Non renseigné"}</p>
        <p><strong>Email :</strong> ${item.customer.email || "Non renseigné"}</p>
        <p><strong>Téléphone :</strong> ${item.customer.phone || "Non renseigné"}</p>
      </article>
      <article>
        <h4>Événement</h4>
        <p><strong>Date :</strong> ${item.eventDate || "Non renseignée"}</p>
        <p><strong>Portions :</strong> ${item.servings || 0}</p>
        <p><strong>Style :</strong> ${item.style || "Custom"}</p>
      </article>
      <article>
        <h4>Estimation</h4>
        <p><strong>Montant :</strong> ${currencyFormatter.format(item.estimatedPrice.amount)} ${item.estimatedPrice.currency}</p>
        <p><strong>Statut :</strong> ${item.status}</p>
        <p><strong>Date création :</strong> ${formatDate(item.createdAt)}</p>
      </article>
    </div>
    <div class="detail-lines">
      <h4>Brief client</h4>
      <p><strong>Saveurs :</strong> ${item.flavors.length > 0 ? item.flavors.join(", ") : "Aucune"}</p>
      <p><strong>Message :</strong> ${item.messageOnCake || "Aucun message"}</p>
      <p><strong>Notes :</strong> ${item.notes || "Aucune note"}</p>
    </div>
  `;
}

function formatDate(value) {
  if (!value) {
    return "Date inconnue";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function deriveAnalytics(dashboard) {
  const orders = dashboard?.dernieresCommandes || [];
  const customerEmails = new Set();
  const productTotals = new Map();
  const salesByDay = new Map();
  const today = new Date();

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    salesByDay.set(date.toISOString().slice(0, 10), 0);
  }

  for (const order of orders) {
    if (order.customer?.email) {
      customerEmails.add(order.customer.email);
    }

    const orderDateKey = new Date(order.createdAt).toISOString().slice(0, 10);
    if (salesByDay.has(orderDateKey)) {
      salesByDay.set(orderDateKey, salesByDay.get(orderDateKey) + Number(order.total || 0));
    }

    for (const item of order.items || []) {
      const current = productTotals.get(item.name) || { quantity: 0, revenue: 0 };
      current.quantity += Number(item.quantity || 0);
      current.revenue += Number(item.quantity || 0) * Number(item.unitPrice || 0);
      productTotals.set(item.name, current);
    }
  }

  const topProducts = Array.from(productTotals.entries())
    .map(([name, stats]) => ({
      name,
      quantity: stats.quantity,
      revenue: stats.revenue
    }))
    .sort((left, right) => right.quantity - left.quantity)
    .slice(0, 5);

  const salesSeries = Array.from(salesByDay.entries()).map(([date, total]) => ({
    label: formatDayLabel(date),
    total
  }));

  return {
    uniqueCustomers: customerEmails.size,
    productCount: productTotals.size,
    topProducts,
    salesSeries
  };
}

function renderSalesChart(series, currency) {
  if (!series || series.length === 0) {
    return renderEmptyChart();
  }

  const width = 640;
  const height = 240;
  const padding = 28;
  const maxValue = Math.max(...series.map((item) => item.total), 100);
  const stepX = (width - padding * 2) / Math.max(series.length - 1, 1);
  const points = series.map((item, index) => {
    const x = padding + stepX * index;
    const y = height - padding - (item.total / maxValue) * (height - padding * 2);
    return { ...item, x, y };
  });
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return `
    <svg viewBox="0 0 ${width} ${height}" class="sales-chart" aria-label="Ventes des 7 derniers jours">
      <defs>
        <linearGradient id="salesArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(255, 92, 145, 0.32)"></stop>
          <stop offset="100%" stop-color="rgba(255, 92, 145, 0.02)"></stop>
        </linearGradient>
      </defs>
      ${[0, 0.25, 0.5, 0.75, 1]
        .map((ratio) => {
          const y = padding + ratio * (height - padding * 2);
          return `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" class="chart-grid-line"></line>`;
        })
        .join("")}
      <path d="${areaPath}" fill="url(#salesArea)"></path>
      <path d="${linePath}" class="chart-line"></path>
      ${points
        .map(
          (point) => `
            <circle cx="${point.x}" cy="${point.y}" r="4.5" class="chart-point"></circle>
            <text x="${point.x}" y="${height - 6}" text-anchor="middle" class="chart-label">${point.label}</text>
          `
        )
        .join("")}
      <text x="${padding}" y="20" class="chart-caption">Total max ${currencyFormatter.format(maxValue)} ${currency}</text>
    </svg>
  `;
}

function renderTopProducts(products) {
  if (!products || products.length === 0) {
    return renderEmptyDonut();
  }

  const colors = ["#ff7ca8", "#ffb347", "#ffd95a", "#72d5a3", "#9f7aea"];
  const total = products.reduce((sum, item) => sum + item.quantity, 0) || 1;
  let offset = 0;
  const segments = products
    .map((item, index) => {
      const value = (item.quantity / total) * 100;
      const segment = `<circle r="70" cx="90" cy="90" fill="transparent" stroke="${colors[index % colors.length]}" stroke-width="28" stroke-dasharray="${value} ${100 - value}" stroke-dashoffset="${-offset}" pathLength="100"></circle>`;
      offset += value;
      return segment;
    })
    .join("");

  return `
    <div class="donut-layout">
      <svg viewBox="0 0 180 180" class="donut-chart" aria-label="Top ventes">
        <g transform="rotate(-90 90 90)">
          ${segments}
        </g>
      </svg>
      <ul class="donut-legend">
        ${products
          .map((item, index) => {
            const percentage = Math.round((item.quantity / total) * 100);
            return `
              <li>
                <span class="legend-dot" style="--dot:${colors[index % colors.length]}"></span>
                <div class="legend-copy">
                  <strong>${item.name}</strong>
                  <small>${item.quantity} ventes (${percentage}%)</small>
                </div>
              </li>
            `;
          })
          .join("")}
      </ul>
    </div>
  `;
}

function renderPopularProducts(products, currency) {
  if (!products || products.length === 0) {
    return `<p class="empty-detail">Aucun produit populaire à afficher.</p>`;
  }

  return products
    .map(
      (item) => `
        <article class="popular-product">
          <div class="popular-product__thumb">${item.name.slice(0, 1)}</div>
          <div class="popular-product__copy">
            <strong>${item.name}</strong>
            <span>${item.quantity} ventes</span>
          </div>
          <div class="popular-product__price">${currencyFormatter.format(item.revenue)} ${currency}</div>
        </article>
      `
    )
    .join("");
}

function renderEmptyChart() {
  return `<div class="empty-chart">Les données de vente apparaîtront ici.</div>`;
}

function renderEmptyDonut() {
  return `<div class="empty-chart">Les top ventes apparaîtront ici.</div>`;
}

function translateStatus(status) {
  return (
    {
      "en-attente": "En attente",
      confirmee: "Confirmée",
      "en-preparation": "En préparation",
      prete: "Prête",
      livree: "Livrée",
      annulee: "Annulée",
      traite: "Traité",
      valide: "Valide",
      refuse: "Refusé"
    }[status] || status
  );
}

function renderKpiCard(item) {
  return `
    <article class="stat-card">
      <div class="stat-card__body">
        <div class="stat-card__content">
          <div class="stat-top">
            <span class="stat-label">${item.label}</span>
            <span class="stat-icon ${item.iconClass}"></span>
          </div>
          <div class="stat-value">${item.value}</div>
          <div class="stat-badge ${item.badgeClass}">${item.note}</div>
        </div>
        <figure class="stat-card__media stat-card__media--${item.mediaClass}">
          <img src="${item.image}" alt="${item.alt}" loading="lazy" />
        </figure>
      </div>
    </article>
  `;
}

function formatDayLabel(value) {
  return new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(new Date(value));
}

async function fetchJson(url, options = {}) {
  const mergedHeaders = {
    "Content-Type": "application/json",
    ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers: mergedHeaders
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    if (response.status === 401) {
      adminToken = "";
      localStorage.removeItem(tokenStorageKey);
      showLogin();
    }
    throw new Error(payload.error?.message || "Erreur API");
  }

  return payload;
}

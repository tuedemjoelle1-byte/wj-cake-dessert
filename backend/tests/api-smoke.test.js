import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { createApp } from "../src/app.js";
import { resetMemoryDb } from "../src/data/memory-store.js";

async function withServer(run) {
  resetMemoryDb();
  const app = createApp();
  const server = createServer(app);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    await run(baseUrl);
  } finally {
    server.close();
    await once(server, "close");
  }
}

async function loginAdmin(baseUrl) {
  const response = await fetch(`${baseUrl}/api/v1/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@wj.local",
      password: "admin1234"
    })
  });
  const body = await response.json();

  assert.equal(response.status, 200);

  return {
    Authorization: `Bearer ${body.accessToken}`
  };
}

test("GET /health renvoie l'etat du service", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.statut, "ok");
    assert.equal(body.service, "wj-api");
  });
});

test("GET /api/v1 expose les routes principales", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.message, "Backend MVP W.J. Cake & Dessert");
    assert.ok(Array.isArray(body.routes.authentification));
    assert.ok(Array.isArray(body.routes.swagger));
  });
});

test("GET /api/v1/catalog/categories renvoie les categories", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/catalog/categories`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.items.length, 3);
    assert.equal(body.items[0].slug, "layer-cakes");
  });
});

test("GET /api/v1/catalog/products filtre par categorie", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/catalog/products?category=bento-cakes`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.items.length, 1);
    assert.equal(body.items[0].slug, "bento-oreo-love");
  });
});

test("GET /api/v1/catalog/products/:slug renvoie 404 si le produit est absent", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/catalog/products/inconnu`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.error.code, "PRODUIT_INTROUVABLE");
  });
});

test("POST /api/v1/auth/register cree un compte", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Joelle",
        lastName: "Fotso",
        email: "joelle@example.com",
        password: "demo1234"
      })
    });
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.user.email, "joelle@example.com");
    assert.ok(body.tokens.accessToken.startsWith("wj."));
  });
});

test("GET /api/v1/me renvoie le profil connecte", async () => {
  await withServer(async (baseUrl) => {
    const loginResponse = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "sara@example.com",
        password: "demo1234"
      })
    });
    const loginBody = await loginResponse.json();

    const response = await fetch(`${baseUrl}/api/v1/me`, {
      headers: {
        Authorization: `Bearer ${loginBody.tokens.accessToken}`
      }
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.item.email, "sara@example.com");
  });
});

test("PATCH /api/v1/me met a jour le profil client", async () => {
  await withServer(async (baseUrl) => {
    const loginResponse = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "sara@example.com",
        password: "demo1234"
      })
    });
    const loginBody = await loginResponse.json();

    const response = await fetch(`${baseUrl}/api/v1/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginBody.tokens.accessToken}`
      },
      body: JSON.stringify({
        firstName: "Sarah",
        newsletter: true
      })
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.item.firstName, "Sarah");
    assert.equal(body.item.preferences.newsletter, true);
  });
});

test("PATCH /api/v1/me/password change le mot de passe", async () => {
  await withServer(async (baseUrl) => {
    const loginResponse = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "sara@example.com",
        password: "demo1234"
      })
    });
    const loginBody = await loginResponse.json();

    const changeResponse = await fetch(`${baseUrl}/api/v1/me/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginBody.tokens.accessToken}`
      },
      body: JSON.stringify({
        currentPassword: "demo1234",
        newPassword: "nouveauSecret123"
      })
    });
    const changeBody = await changeResponse.json();

    assert.equal(changeResponse.status, 200);
    assert.match(changeBody.message, /Mot de passe/);

    const reloginResponse = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "sara@example.com",
        password: "nouveauSecret123"
      })
    });

    assert.equal(reloginResponse.status, 200);
  });
});

test("POST /api/v1/auth/forgot-password puis /reset-password fonctionne", async () => {
  await withServer(async (baseUrl) => {
    const forgotResponse = await fetch(`${baseUrl}/api/v1/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "sara@example.com"
      })
    });
    const forgotBody = await forgotResponse.json();

    assert.equal(forgotResponse.status, 200);
    assert.ok(forgotBody.resetToken);

    const resetResponse = await fetch(`${baseUrl}/api/v1/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: forgotBody.resetToken,
        newPassword: "resetSecret123"
      })
    });

    assert.equal(resetResponse.status, 200);

    const loginResponse = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "sara@example.com",
        password: "resetSecret123"
      })
    });

    assert.equal(loginResponse.status, 200);
  });
});

test("POST puis DELETE /api/v1/me/addresses gere les adresses client", async () => {
  await withServer(async (baseUrl) => {
    const loginResponse = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "sara@example.com",
        password: "demo1234"
      })
    });
    const loginBody = await loginResponse.json();

    const createResponse = await fetch(`${baseUrl}/api/v1/me/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginBody.tokens.accessToken}`
      },
      body: JSON.stringify({
        label: "Maison",
        line1: "Maarif",
        city: "Casablanca",
        zoneCode: "casa-centre",
        isDefault: true
      })
    });
    const createBody = await createResponse.json();
    const addressId = createBody.items[0].id;

    assert.equal(createResponse.status, 201);

    const deleteResponse = await fetch(`${baseUrl}/api/v1/me/addresses/${addressId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${loginBody.tokens.accessToken}`
      }
    });
    const deleteBody = await deleteResponse.json();

    assert.equal(deleteResponse.status, 200);
    assert.equal(deleteBody.items.length, 0);
  });
});

test("POST /api/v1/auth/login connecte un compte existant", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "sara@example.com",
        password: "demo1234"
      })
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.user.email, "sara@example.com");
    assert.ok(body.tokens.refreshToken.startsWith("wjr."));
  });
});

test("POST /api/v1/cart cree un panier et calcule le total", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerEmail: "sara@example.com",
        items: [
          { productSlug: "red-velvet-signature", quantity: 1 },
          { productSlug: "bento-oreo-love", quantity: 1 }
        ]
      })
    });
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.item.items.length, 2);
    assert.equal(body.item.totals.subtotal, 440);
    assert.equal(body.item.totals.deliveryFee, 0);
    assert.equal(body.item.totals.total, 440);
  });
});

test("PATCH /api/v1/cart/:id met a jour un panier existant", async () => {
  await withServer(async (baseUrl) => {
    const createResponse = await fetch(`${baseUrl}/api/v1/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ productSlug: "bento-oreo-love", quantity: 1 }]
      })
    });
    const created = await createResponse.json();

    const updateResponse = await fetch(`${baseUrl}/api/v1/cart/${created.item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ productSlug: "cupcakes-party-box", quantity: 2 }]
      })
    });
    const updated = await updateResponse.json();

    assert.equal(updateResponse.status, 200);
    assert.equal(updated.item.items[0].productSlug, "cupcakes-party-box");
    assert.equal(updated.item.totals.total, 400);
  });
});

test("POST /api/v1/custom-cakes/quote-requests cree une demande de devis", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/custom-cakes/quote-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Imane",
        email: "imane@example.com",
        phone: "+212600000000",
        eventDate: "2026-06-15",
        servings: 30,
        flavors: ["Vanille", "Fruits rouges"]
      })
    });
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.item.status, "en-attente");
    assert.equal(body.item.estimatedPrice.amount, 680);
  });
});

test("GET /swagger.json expose la specification OpenAPI", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/swagger.json`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.openapi, "3.0.3");
    assert.equal(body.info.title, "API W.J. Cake & Dessert");
    assert.ok(body.paths["/api/v1/auth/register"]);
  });
});

test("GET /swagger expose l'interface HTML", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/swagger`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /Swagger UI/i);
    assert.match(body, /swagger\.json/i);
  });
});

test("GET /api/v1/delivery/zones renvoie les zones de livraison", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/delivery/zones`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(body.items.length >= 1);
    assert.equal(body.items[0].currency, "DZD");
  });
});

test("POST /api/v1/orders cree une commande depuis un panier", async () => {
  await withServer(async (baseUrl) => {
    const cartResponse = await fetch(`${baseUrl}/api/v1/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerEmail: "commande@example.com",
        items: [{ productSlug: "red-velvet-signature", quantity: 1 }]
      })
    });
    const cartBody = await cartResponse.json();

    const orderResponse = await fetch(`${baseUrl}/api/v1/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartId: cartBody.item.id,
        customerEmail: "commande@example.com",
        customerName: "Client Test",
        fulfillmentMode: "delivery",
        deliveryAddress: "Casablanca"
      })
    });
    const orderBody = await orderResponse.json();

    assert.equal(orderResponse.status, 201);
    assert.equal(orderBody.item.paymentStatus, "a-payer");
    assert.ok(orderBody.item.number.startsWith("CMD-"));
  });
});

test("POST /api/v1/payments/intent cree une intention de paiement", async () => {
  await withServer(async (baseUrl) => {
    const cartResponse = await fetch(`${baseUrl}/api/v1/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerEmail: "paiement@example.com",
        items: [{ productSlug: "bento-oreo-love", quantity: 2 }]
      })
    });
    const cartBody = await cartResponse.json();

    const orderResponse = await fetch(`${baseUrl}/api/v1/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartId: cartBody.item.id,
        customerEmail: "paiement@example.com"
      })
    });
    const orderBody = await orderResponse.json();

    const paymentResponse = await fetch(`${baseUrl}/api/v1/payments/intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber: orderBody.item.number,
        provider: "demo-cmi",
        returnUrl: "http://localhost:3000"
      })
    });
    const paymentBody = await paymentResponse.json();

    assert.equal(paymentResponse.status, 201);
    assert.equal(paymentBody.item.status, "en-attente");
    assert.equal(paymentBody.item.currency, "DZD");
  });
});

test("GET /api/v1/admin/dashboard renvoie un tableau de bord", async () => {
  await withServer(async (baseUrl) => {
    const headers = await loginAdmin(baseUrl);

    await fetch(`${baseUrl}/api/v1/custom-cakes/quote-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Imane",
        email: "imane@example.com",
        phone: "+212600000000",
        eventDate: "2026-06-15",
        servings: 12,
        flavors: ["Vanille"]
      })
    });

    const cartResponse = await fetch(`${baseUrl}/api/v1/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerEmail: "admin-dashboard@example.com",
        items: [{ productSlug: "red-velvet-signature", quantity: 1 }]
      })
    });
    const cartBody = await cartResponse.json();

    const orderResponse = await fetch(`${baseUrl}/api/v1/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartId: cartBody.item.id,
        customerEmail: "admin-dashboard@example.com",
        customerName: "Dashboard Admin",
        fulfillmentMode: "delivery",
        deliveryAddress: "Casablanca"
      })
    });
    const orderBody = await orderResponse.json();

    await fetch(`${baseUrl}/api/v1/payments/intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber: orderBody.item.number,
        provider: "demo-cmi",
        returnUrl: "http://localhost:3000"
      })
    });

    const response = await fetch(`${baseUrl}/api/v1/admin/dashboard`, { headers });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.item.commandes.total, 1);
    assert.equal(body.item.commandes.enAttente, 1);
    assert.equal(body.item.paiements.total, 1);
    assert.equal(body.item.paiements.enAttente, 1);
    assert.equal(body.item.devis.enAttente, 1);
    assert.equal(body.item.chiffreAffaires.total, 360);
    assert.equal(body.item.chiffreAffaires.currency, "DZD");
    assert.equal(body.item.dernieresCommandes.length, 1);
    assert.equal(body.item.dernieresCommandes[0].number, orderBody.item.number);
    assert.equal(body.item.dernieresCommandes[0].total, 360);
  });
});

test("GET /api/v1/admin/orders renvoie une liste paginee filtrable", async () => {
  await withServer(async (baseUrl) => {
    const headers = await loginAdmin(baseUrl);

    const firstCartResponse = await fetch(`${baseUrl}/api/v1/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerEmail: "commande1@example.com",
        items: [{ productSlug: "red-velvet-signature", quantity: 1 }]
      })
    });
    const firstCartBody = await firstCartResponse.json();

    await fetch(`${baseUrl}/api/v1/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartId: firstCartBody.item.id,
        customerEmail: "commande1@example.com",
        customerName: "Client One",
        fulfillmentMode: "delivery",
        deliveryAddress: "Alger"
      })
    });

    const secondCartResponse = await fetch(`${baseUrl}/api/v1/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerEmail: "commande2@example.com",
        items: [{ productSlug: "bento-oreo-love", quantity: 2 }]
      })
    });
    const secondCartBody = await secondCartResponse.json();

    await fetch(`${baseUrl}/api/v1/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartId: secondCartBody.item.id,
        customerEmail: "commande2@example.com",
        customerName: "Client Two",
        fulfillmentMode: "pickup"
      })
    });

    const response = await fetch(
      `${baseUrl}/api/v1/admin/orders?page=1&pageSize=1&email=commande2@example.com&fulfillmentMode=pickup`,
      { headers }
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.items.length, 1);
    assert.equal(body.items[0].customer.email, "commande2@example.com");
    assert.equal(body.items[0].fulfillmentMode, "pickup");
    assert.equal(body.items[0].currency, "DZD");
    assert.equal(body.meta.page, 1);
    assert.equal(body.meta.pageSize, 1);
    assert.equal(body.meta.totalItems, 1);
  });
});

test("GET /api/v1/admin/orders/:number renvoie le detail complet d'une commande", async () => {
  await withServer(async (baseUrl) => {
    const headers = await loginAdmin(baseUrl);

    const cartResponse = await fetch(`${baseUrl}/api/v1/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerEmail: "detail@example.com",
        items: [{ productSlug: "red-velvet-signature", quantity: 1 }]
      })
    });
    const cartBody = await cartResponse.json();

    const orderResponse = await fetch(`${baseUrl}/api/v1/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartId: cartBody.item.id,
        customerEmail: "detail@example.com",
        customerName: "Client Detail",
        fulfillmentMode: "delivery",
        deliveryAddress: "Alger centre"
      })
    });
    const orderBody = await orderResponse.json();

    const response = await fetch(`${baseUrl}/api/v1/admin/orders/${orderBody.item.number}`, { headers });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.item.number, orderBody.item.number);
    assert.equal(body.item.customer.email, "detail@example.com");
    assert.equal(body.item.delivery.address, "Alger centre");
    assert.equal(body.item.items.length, 1);
    assert.equal(body.item.totals.currency, "DZD");
  });
});

test("PATCH /api/v1/admin/orders/:number/status met a jour le statut et journalise l'action", async () => {
  await withServer(async (baseUrl) => {
    const headers = await loginAdmin(baseUrl);

    const cartResponse = await fetch(`${baseUrl}/api/v1/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerEmail: "status@example.com",
        items: [{ productSlug: "red-velvet-signature", quantity: 1 }]
      })
    });
    const cartBody = await cartResponse.json();

    const orderResponse = await fetch(`${baseUrl}/api/v1/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartId: cartBody.item.id,
        customerEmail: "status@example.com",
        customerName: "Client Status",
        fulfillmentMode: "delivery",
        deliveryAddress: "Alger"
      })
    });
    const orderBody = await orderResponse.json();

    const response = await fetch(`${baseUrl}/api/v1/admin/orders/${orderBody.item.number}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      body: JSON.stringify({
        status: "confirmee"
      })
    });
    const body = await response.json();

    const auditResponse = await fetch(`${baseUrl}/api/v1/admin/audit-logs`, { headers });
    const auditBody = await auditResponse.json();

    assert.equal(response.status, 200);
    assert.equal(body.item.status, "confirmee");
    assert.equal(auditResponse.status, 200);
    assert.ok(auditBody.items.some((item) => item.action === "admin.order.status.update"));
  });
});

test("GET /api/v1/admin/quote-requests et detail devis fonctionnent", async () => {
  await withServer(async (baseUrl) => {
    const headers = await loginAdmin(baseUrl);

    const createResponse = await fetch(`${baseUrl}/api/v1/custom-cakes/quote-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Nadia",
        email: "nadia@example.com",
        phone: "+213600000000",
        eventDate: "2026-06-20",
        servings: 20,
        flavors: ["Vanille", "Chocolat"],
        notes: "Theme floral"
      })
    });
    const createBody = await createResponse.json();

    const listResponse = await fetch(
      `${baseUrl}/api/v1/admin/quote-requests?email=nadia@example.com&page=1&pageSize=5`,
      { headers }
    );
    const listBody = await listResponse.json();

    const detailResponse = await fetch(`${baseUrl}/api/v1/admin/quote-requests/${createBody.item.id}`, { headers });
    const detailBody = await detailResponse.json();

    assert.equal(listResponse.status, 200);
    assert.equal(listBody.items.length, 1);
    assert.equal(listBody.items[0].customer.email, "nadia@example.com");
    assert.equal(detailResponse.status, 200);
    assert.equal(detailBody.item.customer.name, "Nadia");
    assert.equal(detailBody.item.estimatedPrice.currency, "DZD");
  });
});

test("PATCH /api/v1/admin/quote-requests/:id/status met a jour le statut et journalise l'action", async () => {
  await withServer(async (baseUrl) => {
    const headers = await loginAdmin(baseUrl);

    const createResponse = await fetch(`${baseUrl}/api/v1/custom-cakes/quote-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Lina",
        email: "lina@example.com",
        phone: "+213700000000",
        eventDate: "2026-06-22",
        servings: 18,
        flavors: ["Fraise"]
      })
    });
    const createBody = await createResponse.json();

    const updateResponse = await fetch(`${baseUrl}/api/v1/admin/quote-requests/${createBody.item.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({
        status: "valide"
      })
    });
    const updateBody = await updateResponse.json();

    const auditResponse = await fetch(`${baseUrl}/api/v1/admin/audit-logs`, { headers });
    const auditBody = await auditResponse.json();

    assert.equal(updateResponse.status, 200);
    assert.equal(updateBody.item.status, "valide");
    assert.ok(auditBody.items.some((item) => item.action === "admin.quote-request.status.update"));
  });
});

test("GET /api/v1/admin/payments renvoie une liste paginee filtrable", async () => {
  await withServer(async (baseUrl) => {
    const headers = await loginAdmin(baseUrl);

    const cartResponse = await fetch(`${baseUrl}/api/v1/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerEmail: "payment-admin@example.com",
        items: [{ productSlug: "bento-oreo-love", quantity: 2 }]
      })
    });
    const cartBody = await cartResponse.json();

    const orderResponse = await fetch(`${baseUrl}/api/v1/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartId: cartBody.item.id,
        customerEmail: "payment-admin@example.com"
      })
    });
    const orderBody = await orderResponse.json();

    await fetch(`${baseUrl}/api/v1/payments/intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber: orderBody.item.number,
        provider: "demo-cmi",
        returnUrl: "http://localhost:3000"
      })
    });

    const response = await fetch(
      `${baseUrl}/api/v1/admin/payments?page=1&pageSize=5&provider=demo-cmi&status=en-attente`,
      { headers }
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.items.length, 1);
    assert.equal(body.items[0].provider, "demo-cmi");
    assert.equal(body.items[0].status, "en-attente");
    assert.equal(body.items[0].currency, "DZD");
    assert.equal(body.meta.totalItems, 1);
  });
});

test("GET /api/v1/admin/notifications et /audit-logs renvoie des journaux", async () => {
  await withServer(async (baseUrl) => {
    const headers = await loginAdmin(baseUrl);

    await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Joelle",
        lastName: "Fotso",
        email: "journal@example.com",
        password: "demo1234"
      })
    });

    const notificationsResponse = await fetch(`${baseUrl}/api/v1/admin/notifications`, { headers });
    const auditResponse = await fetch(`${baseUrl}/api/v1/admin/audit-logs`, { headers });
    const notificationsBody = await notificationsResponse.json();
    const auditBody = await auditResponse.json();

    assert.equal(notificationsResponse.status, 200);
    assert.equal(auditResponse.status, 200);
    assert.ok(notificationsBody.items.length >= 1);
    assert.ok(auditBody.items.length >= 1);
  });
});

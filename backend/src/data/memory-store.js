const now = () => new Date().toISOString();

import { hashPasswordSync } from "../lib/passwords.js";

export const memoryDb = {
  users: [
    {
      id: "cus_001",
      firstName: "Sara",
      lastName: "Amrani",
      email: "sara@example.com",
      passwordHash: hashPasswordSync("demo1234"),
      emailVerified: true,
      addresses: [],
      preferences: {
        newsletter: false,
        transactionalEmails: true
      }
    }
  ],
  categories: [
    { id: "cat_layer", slug: "layer-cakes", name: "Layer Cakes" },
    { id: "cat_bento", slug: "bento-cakes", name: "Bento Cakes" },
    { id: "cat_cupcakes", slug: "cupcakes", name: "Cupcakes" }
  ],
  products: [
    {
      id: "prd_red_velvet",
      slug: "red-velvet-signature",
      categorySlug: "layer-cakes",
      name: "Red Velvet Signature",
      description: "Layer cake moelleux au cacao doux avec creme onctueuse.",
      basePrice: 320,
      currency: "MAD",
      flavors: ["Vanille", "Red Velvet", "Chocolat"],
      servings: [6, 8, 12],
      minNoticeHours: 48,
      isBestSeller: true
    },
    {
      id: "prd_bento_oreo",
      slug: "bento-oreo-love",
      categorySlug: "bento-cakes",
      name: "Bento Oreo Love",
      description: "Mini gateau cadeau au biscuit Oreo et creme legere.",
      basePrice: 120,
      currency: "MAD",
      flavors: ["Oreo", "Vanille"],
      servings: [2, 4],
      minNoticeHours: 24,
      isBestSeller: true
    },
    {
      id: "prd_cupcake_box",
      slug: "cupcakes-party-box",
      categorySlug: "cupcakes",
      name: "Cupcakes Party Box",
      description: "Boite de cupcakes assortis pour anniversaires et evenements.",
      basePrice: 180,
      currency: "MAD",
      flavors: ["Vanille", "Chocolat", "Caramel"],
      servings: [6, 12],
      minNoticeHours: 24,
      isBestSeller: false
    }
  ],
  carts: [],
  customCakeRequests: [],
  sessions: [],
  passwordResetTokens: [],
  notifications: [],
  auditLogs: [],
  orders: [],
  payments: [],
  deliveryZones: [
    {
      id: "zone_casa_centre",
      code: "casa-centre",
      name: "Casablanca Centre",
      fee: 40,
      currency: "MAD",
      active: true
    },
    {
      id: "zone_casa_ouest",
      code: "casa-ouest",
      name: "Casablanca Ouest",
      fee: 60,
      currency: "MAD",
      active: true
    }
  ],
  deliverySlots: [
    {
      id: "slot_001",
      date: "2026-06-15",
      startTime: "10:00",
      endTime: "12:00",
      type: "delivery",
      available: true
    },
    {
      id: "slot_002",
      date: "2026-06-15",
      startTime: "14:00",
      endTime: "16:00",
      type: "pickup",
      available: true
    }
  ]
};

export function resetMemoryDb() {
  memoryDb.carts = [];
  memoryDb.customCakeRequests = [];
  memoryDb.sessions = [];
  memoryDb.orders = [];
  memoryDb.payments = [];
  memoryDb.users = [
    {
      id: "cus_001",
      firstName: "Sara",
      lastName: "Amrani",
      email: "sara@example.com",
      passwordHash: hashPasswordSync("demo1234"),
      emailVerified: true,
      addresses: [],
      preferences: {
        newsletter: false,
        transactionalEmails: true
      }
    }
  ];
  memoryDb.passwordResetTokens = [];
  memoryDb.notifications = [];
  memoryDb.auditLogs = [];
}

export function memoryTimestamp() {
  return now();
}

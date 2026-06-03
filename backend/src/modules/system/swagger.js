function schemaRef(name) {
  return { $ref: `#/components/schemas/${name}` };
}

export function buildOpenApiSpec() {
  return {
    openapi: "3.0.3",
    info: {
      title: "API W.J. Cake & Dessert",
      version: "0.4.0",
      description: "Documentation Swagger du backend MVP W.J. Cake & Dessert."
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Serveur local"
      },
      {
        url: "https://wj-cake-dessert.onrender.com",
        description: "Serveur de production"
      }
    ],
    security: [{ BearerAuth: [] }],
    tags: [
      { name: "Systeme", description: "Routes techniques et documentation" },
      { name: "Authentification", description: "Inscription et connexion client" },
      { name: "Catalogue", description: "Categories et produits publics" },
      { name: "Panier", description: "Creation et mise a jour du panier" },
      { name: "Gateaux personnalises", description: "Demandes de devis sur mesure" },
      { name: "Commandes", description: "Creation et consultation des commandes" },
      { name: "Paiements", description: "Initialisation des paiements" },
      { name: "Livraison", description: "Zones et creneaux de livraison" },
      { name: "Admin", description: "Vue simplifiee back-office" },
      { name: "Notifications", description: "Journal des notifications simulees" },
      { name: "Audit", description: "Journal d'audit minimal" }
    ],
    paths: {
      "/health": {
        get: {
          tags: ["Systeme"],
          summary: "Verifier l'etat du service",
          security: [],
          responses: { "200": { description: "Service disponible" } }
        }
      },
      "/api/v1/auth/register": {
        post: {
          tags: ["Authentification"],
          summary: "Inscrire un client",
          security: [],
          requestBody: {
            required: true,
            content: { "application/json": { schema: schemaRef("InscriptionRequest") } }
          },
          responses: {
            "201": {
              description: "Compte cree",
              content: { "application/json": { schema: schemaRef("AuthResponse") } }
            }
          }
        }
      },
      "/api/v1/auth/login": {
        post: {
          tags: ["Authentification"],
          summary: "Connecter un client",
          security: [],
          requestBody: {
            required: true,
            content: { "application/json": { schema: schemaRef("ConnexionRequest") } }
          },
          responses: {
            "200": {
              description: "Connexion reussie",
              content: { "application/json": { schema: schemaRef("AuthResponse") } }
            }
          }
        }
      },
      "/api/v1/auth/forgot-password": {
        post: {
          tags: ["Authentification"],
          summary: "Demander une reinitialisation de mot de passe",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email"],
                  properties: { email: { type: "string", example: "joelle@example.com" } }
                }
              }
            }
          },
          responses: { "200": { description: "Demande acceptee" } }
        }
      },
      "/api/v1/auth/reset-password": {
        post: {
          tags: ["Authentification"],
          summary: "Reinitialiser le mot de passe avec un token",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["token", "newPassword"],
                  properties: {
                    token: { type: "string" },
                    newPassword: { type: "string" }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "Mot de passe reinitialise" } }
        }
      },
      "/api/v1/me": {
        get: {
          tags: ["Authentification"],
          summary: "Consulter le profil du client connecte",
          responses: { "200": { description: "Profil client" } }
        },
        patch: {
          tags: ["Authentification"],
          summary: "Mettre a jour le profil du client",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                    newsletter: { type: "boolean" },
                    transactionalEmails: { type: "boolean" }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "Profil mis a jour" } }
        }
      },
      "/api/v1/me/password": {
        patch: {
          tags: ["Authentification"],
          summary: "Changer le mot de passe du client connecte",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["currentPassword", "newPassword"],
                  properties: {
                    currentPassword: { type: "string" },
                    newPassword: { type: "string" }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "Mot de passe modifie" } }
        }
      },
      "/api/v1/me/addresses": {
        get: {
          tags: ["Authentification"],
          summary: "Lister les adresses du client",
          responses: { "200": { description: "Liste des adresses" } }
        },
        post: {
          tags: ["Authentification"],
          summary: "Ajouter une adresse client",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["label", "line1", "city"],
                  properties: {
                    label: { type: "string" },
                    line1: { type: "string" },
                    city: { type: "string" },
                    zoneCode: { type: "string" },
                    isDefault: { type: "boolean" }
                  }
                }
              }
            }
          },
          responses: { "201": { description: "Adresse ajoutee" } }
        }
      },
      "/api/v1/me/addresses/{id}": {
        delete: {
          tags: ["Authentification"],
          summary: "Supprimer une adresse client",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Adresse supprimee" } }
        }
      },
      "/api/v1/catalog/categories": {
        get: {
          tags: ["Catalogue"],
          summary: "Lister les categories",
          security: [],
          responses: { "200": { description: "Liste des categories" } }
        }
      },
      "/api/v1/catalog/products": {
        get: {
          tags: ["Catalogue"],
          summary: "Lister les produits",
          security: [],
          parameters: [
            { name: "category", in: "query", schema: { type: "string" }, description: "Slug de categorie" },
            { name: "q", in: "query", schema: { type: "string" }, description: "Terme de recherche" }
          ],
          responses: { "200": { description: "Liste des produits" } }
        }
      },
      "/api/v1/catalog/products/{slug}": {
        get: {
          tags: ["Catalogue"],
          summary: "Consulter un produit",
          security: [],
          parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Produit trouve" },
            "404": { description: "Produit introuvable" }
          }
        }
      },
      "/api/v1/cart": {
        post: {
          tags: ["Panier"],
          summary: "Creer un panier",
          requestBody: {
            required: true,
            content: { "application/json": { schema: schemaRef("PanierRequest") } }
          },
          responses: {
            "201": {
              description: "Panier cree",
              content: { "application/json": { schema: schemaRef("PanierResponse") } }
            }
          }
        }
      },
      "/api/v1/cart/{id}": {
        patch: {
          tags: ["Panier"],
          summary: "Mettre a jour un panier",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: schemaRef("PanierRequest") } }
          },
          responses: {
            "200": {
              description: "Panier mis a jour",
              content: { "application/json": { schema: schemaRef("PanierResponse") } }
            }
          }
        }
      },
      "/api/v1/custom-cakes/quote-requests": {
        post: {
          tags: ["Gateaux personnalises"],
          summary: "Creer une demande de devis",
          requestBody: {
            required: true,
            content: { "application/json": { schema: schemaRef("DevisSurMesureRequest") } }
          },
          responses: { "201": { description: "Demande creee" } }
        }
      },
      "/api/v1/orders": {
        get: {
          tags: ["Commandes"],
          summary: "Lister les commandes",
          responses: { "200": { description: "Liste des commandes" } }
        },
        post: {
          tags: ["Commandes"],
          summary: "Creer une commande a partir d'un panier",
          requestBody: {
            required: true,
            content: { "application/json": { schema: schemaRef("CommandeRequest") } }
          },
          responses: { "201": { description: "Commande creee" } }
        }
      },
      "/api/v1/orders/{number}": {
        get: {
          tags: ["Commandes"],
          summary: "Consulter une commande",
          parameters: [{ name: "number", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            "200": { description: "Commande trouvee" },
            "404": { description: "Commande introuvable" }
          }
        }
      },
      "/api/v1/payments": {
        get: {
          tags: ["Paiements"],
          summary: "Lister les paiements simules",
          responses: { "200": { description: "Liste des paiements" } }
        }
      },
      "/api/v1/payments/intent": {
        post: {
          tags: ["Paiements"],
          summary: "Creer une intention de paiement",
          requestBody: {
            required: true,
            content: { "application/json": { schema: schemaRef("PaiementIntentRequest") } }
          },
          responses: { "201": { description: "Intention de paiement creee" } }
        }
      },
      "/api/v1/delivery/zones": {
        get: {
          tags: ["Livraison"],
          summary: "Lister les zones de livraison",
          security: [],
          responses: { "200": { description: "Liste des zones" } }
        }
      },
      "/api/v1/delivery/slots": {
        get: {
          tags: ["Livraison"],
          summary: "Lister les creneaux de livraison",
          security: [],
          parameters: [
            { name: "type", in: "query", schema: { type: "string" } },
            { name: "date", in: "query", schema: { type: "string" } }
          ],
          responses: { "200": { description: "Liste des creneaux" } }
        }
      },
      "/api/v1/admin/dashboard": {
        get: {
          tags: ["Admin"],
          summary: "Afficher un tableau de bord simplifie",
          responses: {
            "200": {
              description: "Tableau de bord",
              content: {
                "application/json": {
                  schema: schemaRef("AdminDashboardResponse")
                }
              }
            }
          }
        }
      },
      "/api/v1/admin/orders": {
        get: {
          tags: ["Admin"],
          summary: "Lister les commandes du back-office",
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "integer", default: 1 }
            },
            {
              name: "pageSize",
              in: "query",
              schema: { type: "integer", default: 10 }
            },
            {
              name: "status",
              in: "query",
              schema: { type: "string" }
            },
            {
              name: "email",
              in: "query",
              schema: { type: "string" }
            },
            {
              name: "fulfillmentMode",
              in: "query",
              schema: { type: "string" }
            },
            {
              name: "date",
              in: "query",
              schema: { type: "string", example: "2026-06-02" }
            }
          ],
          responses: {
            "200": {
              description: "Liste paginee des commandes",
              content: {
                "application/json": {
                  schema: schemaRef("AdminOrdersResponse")
                }
              }
            }
          }
        }
      },
      "/api/v1/admin/orders/{number}": {
        get: {
          tags: ["Admin"],
          summary: "Consulter le detail d'une commande back-office",
          parameters: [
            {
              name: "number",
              in: "path",
              required: true,
              schema: { type: "string" }
            }
          ],
          responses: {
            "200": {
              description: "Commande detaillee",
              content: {
                "application/json": {
                  schema: schemaRef("AdminOrderDetailResponse")
                }
              }
            },
            "404": {
              description: "Commande introuvable"
            }
          }
        }
      },
      "/api/v1/admin/orders/{number}/status": {
        patch: {
          tags: ["Admin"],
          summary: "Mettre a jour le statut d'une commande",
          parameters: [
            {
              name: "number",
              in: "path",
              required: true,
              schema: { type: "string" }
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: {
                      type: "string",
                      enum: ["en-attente", "confirmee", "en-preparation", "prete", "livree", "annulee"]
                    }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Commande mise a jour",
              content: {
                "application/json": {
                  schema: schemaRef("AdminOrderDetailResponse")
                }
              }
            },
            "400": {
              description: "Statut invalide"
            },
            "404": {
              description: "Commande introuvable"
            }
          }
        }
      },
      "/api/v1/admin/quote-requests": {
        get: {
          tags: ["Admin"],
          summary: "Lister les demandes de devis du back-office",
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "integer", default: 1 }
            },
            {
              name: "pageSize",
              in: "query",
              schema: { type: "integer", default: 10 }
            },
            {
              name: "status",
              in: "query",
              schema: { type: "string" }
            },
            {
              name: "email",
              in: "query",
              schema: { type: "string" }
            },
            {
              name: "date",
              in: "query",
              schema: { type: "string", example: "2026-06-03" }
            }
          ],
          responses: {
            "200": {
              description: "Liste paginee des devis",
              content: {
                "application/json": {
                  schema: schemaRef("AdminQuoteRequestsResponse")
                }
              }
            }
          }
        }
      },
      "/api/v1/admin/quote-requests/{id}": {
        get: {
          tags: ["Admin"],
          summary: "Consulter le detail d'une demande de devis",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" }
            }
          ],
          responses: {
            "200": {
              description: "Devis detaille",
              content: {
                "application/json": {
                  schema: schemaRef("AdminQuoteRequestDetailResponse")
                }
              }
            },
            "404": {
              description: "Devis introuvable"
            }
          }
        }
      },
      "/api/v1/admin/quote-requests/{id}/status": {
        patch: {
          tags: ["Admin"],
          summary: "Mettre a jour le statut d'une demande de devis",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" }
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: {
                      type: "string",
                      enum: ["en-attente", "traite", "valide", "refuse"]
                    }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Devis mis a jour",
              content: {
                "application/json": {
                  schema: schemaRef("AdminQuoteRequestDetailResponse")
                }
              }
            },
            "400": {
              description: "Statut invalide"
            },
            "404": {
              description: "Devis introuvable"
            }
          }
        }
      },
      "/api/v1/admin/payments": {
        get: {
          tags: ["Admin"],
          summary: "Lister les paiements du back-office",
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "integer", default: 1 }
            },
            {
              name: "pageSize",
              in: "query",
              schema: { type: "integer", default: 10 }
            },
            {
              name: "status",
              in: "query",
              schema: { type: "string" }
            },
            {
              name: "provider",
              in: "query",
              schema: { type: "string" }
            },
            {
              name: "date",
              in: "query",
              schema: { type: "string", example: "2026-06-03" }
            }
          ],
          responses: {
            "200": {
              description: "Liste paginee des paiements",
              content: {
                "application/json": {
                  schema: schemaRef("AdminPaymentsResponse")
                }
              }
            }
          }
        }
      },
      "/api/v1/admin/notifications": {
        get: {
          tags: ["Notifications"],
          summary: "Lister les notifications generees",
          responses: { "200": { description: "Liste des notifications" } }
        }
      },
      "/api/v1/admin/audit-logs": {
        get: {
          tags: ["Audit"],
          summary: "Lister le journal d'audit",
          responses: { "200": { description: "Journal d'audit" } }
        }
      }
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        InscriptionRequest: {
          type: "object",
          required: ["firstName", "lastName", "email", "password"],
          properties: {
            firstName: { type: "string", example: "Joelle" },
            lastName: { type: "string", example: "Fotso" },
            email: { type: "string", example: "joelle@example.com" },
            password: { type: "string", example: "demo1234" }
          }
        },
        ConnexionRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "joelle@example.com" },
            password: { type: "string", example: "demo1234" }
          }
        },
        Utilisateur: {
          type: "object",
          properties: {
            id: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
            emailVerified: { type: "boolean" }
          }
        },
        Jetons: {
          type: "object",
          properties: {
            accessToken: { type: "string" },
            refreshToken: { type: "string" },
            userId: { type: "string" },
            createdAt: { type: "string" }
          }
        },
        AuthResponse: {
          type: "object",
          properties: {
            user: schemaRef("Utilisateur"),
            tokens: schemaRef("Jetons")
          }
        },
        PanierLigneRequest: {
          type: "object",
          required: ["productSlug", "quantity"],
          properties: {
            productSlug: { type: "string", example: "red-velvet-signature" },
            quantity: { type: "integer", example: 1 }
          }
        },
        PanierRequest: {
          type: "object",
          properties: {
            customerEmail: { type: "string", example: "sara@example.com" },
            items: { type: "array", items: schemaRef("PanierLigneRequest") }
          }
        },
        PanierResponse: {
          type: "object",
          properties: { item: { type: "object" } }
        },
        DevisSurMesureRequest: {
          type: "object",
          required: ["customerName", "email", "phone", "eventDate"],
          properties: {
            customerName: { type: "string", example: "Imane" },
            email: { type: "string", example: "imane@example.com" },
            phone: { type: "string", example: "+212600000000" },
            eventDate: { type: "string", example: "2026-06-15" },
            servings: { type: "integer", example: 30 },
            style: { type: "string", example: "floral" },
            flavors: { type: "array", items: { type: "string" }, example: ["Vanille", "Fruits rouges"] },
            messageOnCake: { type: "string", example: "Joyeux anniversaire" },
            notes: { type: "string", example: "Inspiration mariage chic blanc et or." }
          }
        },
        CommandeRequest: {
          type: "object",
          required: ["cartId"],
          properties: {
            cartId: { type: "string", example: "cart_abc12345" },
            customerEmail: { type: "string", example: "sara@example.com" },
            customerName: { type: "string", example: "Sara Amrani" },
            fulfillmentMode: { type: "string", example: "delivery" },
            deliveryAddress: { type: "string", example: "Maarif, Casablanca" },
            slotId: { type: "string", example: "slot_001" }
          }
        },
        PaiementIntentRequest: {
          type: "object",
          required: ["orderNumber"],
          properties: {
            orderNumber: { type: "string", example: "CMD-1716230400000" },
            provider: { type: "string", example: "demo-cmi" },
            returnUrl: { type: "string", example: "http://localhost:3000" }
          }
        },
        AdminDashboardResponse: {
          type: "object",
          properties: {
            item: {
              type: "object",
              properties: {
                chiffreAffaires: {
                  type: "object",
                  properties: {
                    total: { type: "number", example: 440 },
                    currency: { type: "string", example: "DZD" }
                  }
                },
                commandes: {
                  type: "object",
                  properties: {
                    total: { type: "integer", example: 3 },
                    enAttente: { type: "integer", example: 1 }
                  }
                },
                paiements: {
                  type: "object",
                  properties: {
                    total: { type: "integer", example: 2 },
                    enAttente: { type: "integer", example: 1 }
                  }
                },
                devis: {
                  type: "object",
                  properties: {
                    enAttente: { type: "integer", example: 4 }
                  }
                },
                dernieresCommandes: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      number: { type: "string" },
                      customerEmail: { type: "string" },
                      customerName: { type: "string", nullable: true },
                      status: { type: "string" },
                      paymentStatus: { type: "string" },
                      fulfillmentMode: { type: "string" },
                      total: { type: "number" },
                      currency: { type: "string" },
                      createdAt: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        },
        AdminOrdersResponse: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  number: { type: "string" },
                  status: { type: "string" },
                  paymentStatus: { type: "string" },
                  fulfillmentMode: { type: "string" },
                  customer: {
                    type: "object",
                    properties: {
                      name: { type: "string", nullable: true },
                      email: { type: "string", nullable: true }
                    }
                  },
                  total: { type: "number" },
                  currency: { type: "string", example: "DZD" },
                  createdAt: { type: "string" }
                }
              }
            },
            meta: {
              type: "object",
              properties: {
                page: { type: "integer" },
                pageSize: { type: "integer" },
                totalItems: { type: "integer" },
                totalPages: { type: "integer" }
              }
            }
          }
        },
        AdminOrderDetailResponse: {
          type: "object",
          properties: {
            item: {
              type: "object",
              properties: {
                id: { type: "string" },
                number: { type: "string" },
                status: { type: "string" },
                paymentStatus: { type: "string" },
                fulfillmentMode: { type: "string" },
                customer: {
                  type: "object",
                  properties: {
                    name: { type: "string", nullable: true },
                    email: { type: "string", nullable: true }
                  }
                },
                delivery: {
                  type: "object",
                  properties: {
                    address: { type: "string", nullable: true },
                    slotId: { type: "string", nullable: true }
                  }
                },
                items: {
                  type: "array",
                  items: {
                    type: "object"
                  }
                },
                totals: {
                  type: "object",
                  properties: {
                    subtotal: { type: "number" },
                    deliveryFee: { type: "number" },
                    total: { type: "number" },
                    currency: { type: "string", example: "DZD" }
                  }
                },
                createdAt: { type: "string" }
              }
            }
          }
        },
        AdminQuoteRequestsResponse: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  status: { type: "string" },
                  customer: {
                    type: "object",
                    properties: {
                      name: { type: "string", nullable: true },
                      email: { type: "string", nullable: true },
                      phone: { type: "string", nullable: true }
                    }
                  },
                  eventDate: { type: "string" },
                  servings: { type: "integer" },
                  estimatedPrice: {
                    type: "object",
                    properties: {
                      amount: { type: "number" },
                      currency: { type: "string", example: "DZD" }
                    }
                  },
                  createdAt: { type: "string" }
                }
              }
            },
            meta: {
              type: "object",
              properties: {
                page: { type: "integer" },
                pageSize: { type: "integer" },
                totalItems: { type: "integer" },
                totalPages: { type: "integer" }
              }
            }
          }
        },
        AdminQuoteRequestDetailResponse: {
          type: "object",
          properties: {
            item: {
              type: "object",
              properties: {
                id: { type: "string" },
                status: { type: "string" },
                customer: {
                  type: "object",
                  properties: {
                    name: { type: "string", nullable: true },
                    email: { type: "string", nullable: true },
                    phone: { type: "string", nullable: true }
                  }
                },
                eventDate: { type: "string" },
                servings: { type: "integer" },
                style: { type: "string" },
                flavors: {
                  type: "array",
                  items: { type: "string" }
                },
                messageOnCake: { type: "string" },
                notes: { type: "string" },
                estimatedPrice: {
                  type: "object",
                  properties: {
                    amount: { type: "number" },
                    currency: { type: "string", example: "DZD" },
                    disclaimer: { type: "string" }
                  }
                },
                createdAt: { type: "string" }
              }
            }
          }
        },
        AdminPaymentsResponse: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  orderNumber: { type: "string" },
                  provider: { type: "string" },
                  status: { type: "string" },
                  amount: { type: "number" },
                  currency: { type: "string", example: "DZD" },
                  createdAt: { type: "string" }
                }
              }
            },
            meta: {
              type: "object",
              properties: {
                page: { type: "integer" },
                pageSize: { type: "integer" },
                totalItems: { type: "integer" },
                totalPages: { type: "integer" }
              }
            }
          }
        }
      }
    }
  };
}

export function renderSwaggerHtml() {
  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Swagger - W.J. Cake & Dessert</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      body { margin: 0; background: #faf6ef; }
      .topbar { display: none; }
      .swagger-ui .information-container { padding: 24px 0; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = function () {
        if (!window.SwaggerUIBundle) {
          document.body.innerHTML = '<div style="padding:24px;font-family:sans-serif">Impossible de charger Swagger UI depuis le CDN. Ouvre /swagger.json pour voir la specification brute.</div>';
          return;
        }
        window.SwaggerUIBundle({
          url: '/swagger.json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          docExpansion: 'list',
          defaultModelsExpandDepth: 1,
          displayRequestDuration: true
        });
      };
    </script>
  </body>
</html>`;
}

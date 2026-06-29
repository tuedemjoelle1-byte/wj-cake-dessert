const apiBase = "/api/v1";

const currencyLabel = "DHS";

const fallbackProducts = [
  {
    id: 1,
    slug: "box-cupcakes-signature-wj",
    name: "Box Cupcakes Signature W.J.",
    category: "Cupcakes",
    price: 180,
    image:
      "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?q=80&w=1200&auto=format&fit=crop",
    tag: "Best-seller",
    description:
      "6 cupcakes artisanaux avec glaçage vanille, chocolat intense et fruits rouges."
  },
  {
    id: 2,
    slug: "layer-cake-anniversaire-rose",
    name: "Layer Cake Anniversaire Rose",
    category: "Gateaux",
    price: 320,
    image:
      "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?q=80&w=1200&auto=format&fit=crop",
    tag: "Personnalisable",
    description: "Layer cake élégant personnalisé avec message, couleur et parfum au choix."
  },
  {
    id: 3,
    slug: "mini-delices-party-box",
    name: "Mini Délices Party Box",
    category: "Coffrets",
    price: 240,
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1200&auto=format&fit=crop",
    tag: "A offrir",
    description: "Mini pâtisseries pour anniversaire, brunch ou attention sucrée à offrir."
  },
  {
    id: 4,
    slug: "cupcakes-chocolat-intense",
    name: "Cupcakes Chocolat Intense",
    category: "Cupcakes",
    price: 160,
    image:
      "https://images.unsplash.com/photo-1587668178277-295251f900ce?q=80&w=1200&auto=format&fit=crop",
    tag: "Gourmand",
    description: "Base cacao, topping chocolat, copeaux fondants et finition premium."
  },
  {
    id: 5,
    slug: "wedding-cake-sur-mesure",
    name: "Wedding Cake Sur Mesure",
    category: "Evenements",
    price: 950,
    image:
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=1200&auto=format&fit=crop",
    tag: "Sur devis",
    description: "Création chic sur devis pour mariage, fiançailles ou réception privée."
  },
  {
    id: 6,
    slug: "bento-cake-cadeau",
    name: "Bento Cake Cadeau",
    category: "Cadeaux",
    price: 120,
    image:
      "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1200&auto=format&fit=crop",
    tag: "Decouverte",
    description: "Petit gâteau cadeau à personnaliser pour surprise, attention ou mini célébration."
  }
];

const occasions = [
  {
    title: "Anniversaires enfants",
    image: "./client-cake-ariel.jpeg",
    text: "Themes sirene, personnages et couleurs franches pour des gateaux qui marquent la fete."
  },
  {
    title: "Anniversaires chic",
    image: "./client-cake-birthday.jpeg",
    text: "Finitions propres, couleurs douces et rendu elegant pour les celebrations adultes."
  },
  {
    title: "Modeles personnages",
    image: "./client-cake-minnie.jpeg",
    text: "Creations visuelles fortes pour Minnie, princesses et univers sur mesure."
  },
  {
    title: "Cadeaux et corporate",
    image: "./client-cake-corporate.jpeg",
    text: "Gateaux photo, messages de remerciement et commandes pensees pour les moments pros."
  }
];

const reviews = [
  {
    name: "Cliente satisfaite",
    text: "Le gateau etait parfait, j'ai beaucoup aime, surtout la creme rouge et verte.",
    rating: 5,
    theme: "Gout",
    source: "Retour WhatsApp",
    image: "./client-review-perfect.jpeg",
    featured: true
  },
  {
    name: "Cliente buche",
    text: "Merci beaucoup, c'etait tres beau et bon.",
    rating: 5,
    theme: "Visuel",
    source: "Retour WhatsApp",
    image: "./client-review-beau-bon.jpeg",
    featured: true
  },
  {
    name: "Cliente fidelisee",
    text: "Waw, je suis tres satisfaite. Le 01 inchallah on va encore commander.",
    rating: 5,
    theme: "Commande a nouveau",
    source: "Retour WhatsApp",
    image: "./client-review-recommande.jpeg",
    featured: true
  },
  {
    name: "Cliente famille",
    text: "Le gateau etait super, bien prepare, bien doux, les invites ont aime. Cote bon seulement laisse.",
    rating: 5,
    theme: "Invites",
    source: "Retour WhatsApp",
    image: "./client-review-invites.jpeg"
  },
  {
    name: "Cliente anniversaire enfants",
    text: "Je suis pas tres gateaux mais j'ai beaucoup aime, et les enfants ont tous fini ce qu'on leur a servi.",
    rating: 5,
    theme: "Enfants",
    source: "Retour WhatsApp",
    image: "./client-review-magique.jpeg"
  },
  {
    name: "Keren Vera",
    text: "Je n'ai jamais mange un gateau aussi bon de ma vie je te jure.",
    rating: 5,
    theme: "Coup de coeur",
    source: "Message client",
    image: "./client-review-best.jpeg"
  }
];

const gallery = [
  {
    image: "./client-cake-ariel.jpeg",
    alt: "Gateau Ariel rose et bleu pour enfant",
    title: "Theme Ariel"
  },
  {
    image: "./client-cake-minnie.jpeg",
    alt: "Gateau Minnie rose avec papillons et spheres",
    title: "Minnie chic"
  },
  {
    image: "./client-cake-birthday.jpeg",
    alt: "Gateau Happy Birthday blanc et nude avec spheres dorees",
    title: "Birthday elegant"
  },
  {
    image: "./client-cake-purple.jpeg",
    alt: "Gateau violet avec message romantique",
    title: "Message personalise"
  },
  {
    image: "./client-cake-mermaid.jpeg",
    alt: "Gateau sirene colore avec decor marin",
    title: "Sirene coloree"
  },
  {
    image: "./client-cake-corporate.jpeg",
    alt: "Gateau photo corporate avec message de remerciement",
    title: "Corporate"
  },
  {
    image: "./client-cake-slice.jpeg",
    alt: "Part de gateau montrant la garniture fruits rouges et creme",
    title: "Coupe interieure"
  },
  {
    image: "./client-cake-inside.jpeg",
    alt: "Gateau coupe montrant plusieurs couches et garniture",
    title: "Texture"
  }
];

const cakeSizes = [
  { label: "6 parts", servings: 6, extra: 0 },
  { label: "8 parts", servings: 8, extra: 12 },
  { label: "12 parts", servings: 12, extra: 28 }
];

const cakeFlavors = [
  { label: "Vanille fraise", extra: 0 },
  { label: "Chocolat intense", extra: 4 },
  { label: "Red velvet", extra: 6 }
];

const cakeFinishes = [
  { label: "Simple", extra: 0 },
  { label: "Message + couleur", extra: 8 },
  { label: "Theme complet", extra: 18 }
];

const imageMap = {
  "red-velvet-signature":
    "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?q=80&w=1200&auto=format&fit=crop",
  "bento-oreo-love":
    "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=1200&auto=format&fit=crop",
  "cupcakes-party-box":
    "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?q=80&w=1200&auto=format&fit=crop"
};

const state = {
  apiAvailable: false,
  selectedCategory: "Tous",
  products: [...fallbackProducts],
  zonesCount: 0,
  selectedSize: cakeSizes[0],
  selectedFlavor: cakeFlavors[0],
  selectedFinish: cakeFinishes[1]
};

const elements = {
  apiStatus: document.querySelector("#api-status"),
  menuItem: document.querySelector("#menuItem"),
  menuToggle: document.querySelector("#menu-toggle"),
  mobileNav: document.querySelector("#mobile-nav"),
  categoryPills: document.querySelector("#category-pills"),
  productsGrid: document.querySelector("#products-grid"),
  productsCount: document.querySelector("#products-count"),
  zonesCount: document.querySelector("#zones-count"),
  sizeOptions: document.querySelector("#size-options"),
  flavorOptions: document.querySelector("#flavor-options"),
  finishOptions: document.querySelector("#finish-options"),
  customMessage: document.querySelector("#custom-message"),
  summarySize: document.querySelector("#summary-size"),
  summaryFlavor: document.querySelector("#summary-flavor"),
  summaryFinish: document.querySelector("#summary-finish"),
  summaryMessage: document.querySelector("#summary-message"),
  cakePrice: document.querySelector("#cake-price"),
  customCakeForm: document.querySelector("#custom-cake-form"),
  customCakeResult: document.querySelector("#custom-cake-result"),
  occasionGrid: document.querySelector("#occasion-grid"),
  reviewsGrid: document.querySelector("#reviews-grid"),
  galleryGrid: document.querySelector("#gallery-grid"),
  revealBlocks: Array.from(document.querySelectorAll(".reveal")),
  parallaxSurfaces: Array.from(document.querySelectorAll(".parallax-surface"))
};

boot().catch((error) => {
  elements.apiStatus.textContent = `Mode vitrine locale : ${error.message}`;
  renderAll();
});

async function boot() {
  bindEvents();
  setupBrandCakeLogo();
  setupMotion();
  renderStaticCollections();
  renderOptionGroups();
  renderAll();

  try {
    const productsResponse = await fetchJson(`${apiBase}/catalog/products`);
    state.apiAvailable = true;
    state.products = productsResponse.items.map(toUiProduct);
    elements.apiStatus.textContent = "Catalogue et livraison connectés au backend W.J. Cake & Dessert.";
    renderAll();
  } catch (error) {
    elements.apiStatus.textContent = "API indisponible, affichage du catalogue de démonstration W.J. Cake & Dessert.";
  }

  try {
    const zonesResponse = await fetchJson(`${apiBase}/delivery/zones`);
    state.zonesCount = zonesResponse.items.length;
  } catch (error) {
    state.zonesCount = 0;
  }

  renderAll();
}

function setupBrandCakeLogo() {
  const logo = document.querySelector(".brand-cake-logo");

  if (!logo || !elements.menuItem) {
    return;
  }

  const classNames = ["subcake1", "subcake2", "subcake3", "subcake4", "subcake5", "subcake6"];
  const labels = {
    subcake1: "Layer cakes",
    subcake2: "Cupcakes signature",
    subcake3: "Coffrets maison",
    subcake4: "Evenementiel",
    subcake5: "Sur mesure",
    subcake6: "Livraison Casablanca"
  };
  const colors = {
    subcake1: "#ebd4d4",
    subcake2: "#a3c9d4",
    subcake3: "#f3eca7",
    subcake4: "#f6f0f0",
    subcake5: "#e3adad",
    subcake6: "#cadbc1"
  };
  const targets = {
    subcake1: "#products",
    subcake2: "#products",
    subcake3: "#occasions",
    subcake4: "#reviews",
    subcake5: "#custom",
    subcake6: "#contact"
  };
  const sliceTransforms = {
    subcake1: "translate(-12px, -14px)",
    subcake2: "translate(4px, -18px)",
    subcake3: "translate(18px, -4px)",
    subcake4: "translate(14px, 14px)",
    subcake5: "translate(0px, 18px)",
    subcake6: "translate(-16px, 10px)"
  };

  const takeCake = (className, howMuch) => {
    const nodes = logo.querySelectorAll(`.${className}`);
    const isActive = howMuch !== "translateY(0)";

    elements.menuItem.textContent = isActive ? labels[className] : "W.J. Cake & Dessert";
    elements.menuItem.style.transitionTimingFunction = "ease-in";
    elements.menuItem.style.transition = "0.1s";

    if (isActive) {
      elements.menuItem.style.color = "#5d2a39";
      elements.menuItem.style.textDecoration = "underline";
      elements.menuItem.style.textDecorationColor = colors[className];
      elements.menuItem.style.textUnderlineOffset = "0.18em";
    } else {
      elements.menuItem.style.color = "";
      elements.menuItem.style.textDecoration = "none";
      elements.menuItem.style.textDecorationColor = "";
    }

    for (const node of nodes) {
      node.style.transitionTimingFunction = "ease-in";
      node.style.transition = "0.3s";
      node.style.transform = howMuch;
    }
  };

  for (const className of classNames) {
    const nodes = logo.querySelectorAll(`.${className}`);
    const sliceTransform = sliceTransforms[className];

    for (const node of nodes) {
      node.setAttribute("tabindex", "0");
      node.setAttribute("role", "button");
      node.setAttribute("focusable", "true");
      node.setAttribute("aria-label", labels[className]);
      node.style.cursor = "pointer";
      node.style.pointerEvents = "bounding-box";

      node.addEventListener("pointerenter", () => {
        takeCake(className, sliceTransform);
      });

      node.addEventListener("pointerleave", () => {
        takeCake(className, "translateY(0)");
      });

      node.addEventListener("focus", () => {
        takeCake(className, sliceTransform);
      });

      node.addEventListener("blur", () => {
        takeCake(className, "translateY(0)");
      });

      node.addEventListener("click", () => {
        const target = document.querySelector(targets[className]);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });

      node.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          const target = document.querySelector(targets[className]);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    }
  }
}

function bindEvents() {
  elements.menuToggle.addEventListener("click", () => {
    elements.mobileNav.classList.toggle("is-open");
    elements.menuToggle.classList.toggle("is-open");
  });

  elements.customMessage.addEventListener("input", () => {
    renderSummary();
  });

  elements.customCakeForm.addEventListener("submit", handleCustomCakeSubmit);
}

function setupMotion() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    for (const block of elements.revealBlocks) {
      if (!block.classList.contains("reveal-visible")) {
        observer.observe(block);
      }
    }

    window.addEventListener(
      "scroll",
      () => {
        const offset = Math.min(window.scrollY * 0.05, 18);
        for (const surface of elements.parallaxSurfaces) {
          surface.style.transform = `translateY(${offset}px)`;
        }
      },
      { passive: true }
    );
  } else {
    for (const block of elements.revealBlocks) {
      block.classList.add("reveal-visible");
    }
  }
}

function renderAll() {
  renderCategories();
  renderProducts();
  renderSummary();
  elements.productsCount.textContent = `${state.products.length} produits`;
  elements.zonesCount.textContent = `${state.zonesCount || 0} zones`;
}

function renderStaticCollections() {
  const featuredReviews = reviews.filter((review) => review.featured);
  const moreReviews = reviews.filter((review) => !review.featured);

  elements.occasionGrid.innerHTML = occasions
    .map(
      (occasion) => `
        <article class="occasion-card">
          <img src="${occasion.image}" alt="${occasion.title}" loading="lazy" decoding="async" />
          <div class="occasion-card__body">
            <h3>${occasion.title}</h3>
            <p>${occasion.text}</p>
          </div>
        </article>
      `
    )
    .join("");

  elements.reviewsGrid.innerHTML = `
    <div class="reviews-featured">
      ${featuredReviews
        .map(
          (review) => `
        <article class="review-card review-card--featured">
          <div class="review-card__media">
            <img src="${review.image}" alt="${review.name}" loading="lazy" decoding="async" />
          </div>
          <div class="review-card__body">
          <span class="review-theme">${review.theme}</span>
          <div class="review-stars">${"★".repeat(review.rating)}</div>
          <p>"${review.text}"</p>
          <span class="review-source">${review.source}</span>
          <strong>${review.name}</strong>
          </div>
        </article>
      `
        )
        .join("")}
    </div>
    <div class="reviews-more">
      <p class="reviews-more__title">Autres retours clients</p>
      <div class="reviews-grid reviews-grid--secondary">
        ${moreReviews
          .map(
      (review) => `
        <article class="review-card">
          <div class="review-card__media">
            <img src="${review.image}" alt="${review.name}" loading="lazy" decoding="async" />
          </div>
          <div class="review-card__body">
          <span class="review-theme">${review.theme}</span>
          <div class="review-stars">${"★".repeat(review.rating)}</div>
          <p>"${review.text}"</p>
          <span class="review-source">${review.source}</span>
          <strong>${review.name}</strong>
          </div>
        </article>
      `
          )
          .join("")}
      </div>
    </div>
  `;

  elements.galleryGrid.innerHTML = gallery
    .map(
      (item) => `
        <figure class="gallery-item">
          <img src="${item.image}" alt="${item.alt}" loading="lazy" decoding="async" />
          <figcaption>${item.title}</figcaption>
        </figure>
      `
    )
    .join("");
}

function renderOptionGroups() {
  renderOptions(elements.sizeOptions, cakeSizes, state.selectedSize, (item) => {
    state.selectedSize = item;
    renderOptionGroups();
    renderSummary();
  });

  renderOptions(elements.flavorOptions, cakeFlavors, state.selectedFlavor, (item) => {
    state.selectedFlavor = item;
    renderOptionGroups();
    renderSummary();
  });

  renderOptions(elements.finishOptions, cakeFinishes, state.selectedFinish, (item) => {
    state.selectedFinish = item;
    renderOptionGroups();
    renderSummary();
  });
}

function renderOptions(container, options, selected, onSelect) {
  container.innerHTML = "";

  for (const option of options) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `option-button ${selected.label === option.label ? "is-selected" : ""}`;
    button.innerHTML = `
      <strong>${option.label}</strong>
      <span>+${option.extra} ${currencyLabel}</span>
    `;
    button.addEventListener("click", () => onSelect(option));
    container.append(button);
  }
}

function renderCategories() {
  const categories = ["Tous", ...new Set(state.products.map((product) => product.category))];
  elements.categoryPills.innerHTML = "";

  for (const category of categories) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `pill-button ${state.selectedCategory === category ? "is-active" : ""}`;
    button.textContent = category;
    button.addEventListener("click", () => {
      state.selectedCategory = category;
      renderCategories();
      renderProducts();
    });
    elements.categoryPills.append(button);
  }
}

function renderProducts() {
  const products = getProductsByCategory(state.products, state.selectedCategory);
  elements.productsGrid.innerHTML = "";

  for (const product of products) {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-card__image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async" />
        <span class="product-tag">${product.tag}</span>
      </div>
      <div class="product-card__body">
        <p class="product-category">${product.category}</p>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-footer">
          <strong>${product.price} ${currencyLabel}</strong>
          <button class="button button-accent product-cta" data-product-slug="${product.slug}" type="button">
            Ajouter au panier
          </button>
        </div>
      </div>
    `;
    elements.productsGrid.append(card);
  }

  for (const button of document.querySelectorAll(".product-cta")) {
    button.addEventListener("click", handleAddToCart);
  }
}

function renderSummary() {
  elements.summarySize.textContent = state.selectedSize.label;
  elements.summaryFlavor.textContent = state.selectedFlavor.label;
  elements.summaryFinish.textContent = state.selectedFinish.label;
  elements.summaryMessage.textContent = `"${elements.customMessage.value || "Message personnalise"}"`;
  elements.cakePrice.textContent = `${calculateCakePrice(
    state.selectedSize.extra,
    state.selectedFlavor.extra,
    state.selectedFinish.extra
  )} ${currencyLabel}`;
}

async function handleAddToCart(event) {
  const productSlug = event.currentTarget.dataset.productSlug;

  if (!state.apiAvailable) {
    elements.customCakeResult.textContent = formatJson({
      info: "Le backend n'est pas joignable. Le front reste en mode vitrine pour le moment."
    });
    return;
  }

  try {
    const result = await fetchJson(`${apiBase}/cart`, {
      method: "POST",
      body: JSON.stringify({
        customerEmail: "client@sweetmaison.test",
        items: [{ productSlug, quantity: 1 }]
      })
    });

    elements.customCakeResult.textContent = formatJson({
      message: "Produit ajouté au panier de test.",
      cart: result.item
    });
  } catch (error) {
    elements.customCakeResult.textContent = formatJson({ error: error.message });
  }
}

async function handleCustomCakeSubmit(event) {
  event.preventDefault();

  const formData = new FormData(elements.customCakeForm);
  const payload = {
    customerName: String(formData.get("customerName") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    eventDate: String(formData.get("eventDate") || "").trim(),
    servings: state.selectedSize.servings,
    style: state.selectedFinish.label,
    flavors: [state.selectedFlavor.label],
    messageOnCake: String(formData.get("messageOnCake") || "").trim(),
    notes: String(formData.get("notes") || "").trim()
  };

  if (!state.apiAvailable) {
    elements.customCakeResult.innerHTML = formatQuotePreview(payload);
    return;
  }

  try {
    const result = await fetchJson(`${apiBase}/custom-cakes/quote-requests`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    elements.customCakeResult.innerHTML = formatQuoteSuccess(result.item);
    elements.customCakeForm.reset();
    elements.customMessage.value = "";
    renderSummary();
  } catch (error) {
    elements.customCakeResult.innerHTML = formatQuoteError(error);
  }
}

function getProductsByCategory(productList, category) {
  if (category === "Tous") {
    return productList;
  }

  return productList.filter((product) => product.category === category);
}

function calculateCakePrice(sizeExtra, flavorExtra, finishExtra) {
  return 49 + sizeExtra + flavorExtra + finishExtra;
}

function toUiProduct(product) {
  const mappedCategory = mapCategory(product.categorySlug);
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: mappedCategory,
    price: product.basePrice,
    image: imageMap[product.slug] || fallbackProducts[0].image,
    tag: product.isBestSeller ? "Best-seller" : mappedCategory,
    description: product.description
  };
}

function mapCategory(categorySlug) {
  const mapping = {
    cupcakes: "Cupcakes",
    "bento-cakes": "Cadeaux",
    "layer-cakes": "Gateaux"
  };

  return mapping[categorySlug] || "Coffrets";
}

async function fetchJson(url, options = {}) {
  const response = await fetch(resolveApiUrl(url), {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(payload.error?.message || "Erreur API");
  }

  return payload;
}

function formatJson(value) {
  return JSON.stringify(value, null, 2);
}

function formatQuotePreview(payload) {
  return `
    <div class="quote-feedback quote-feedback--preview">
      <strong>Mode vitrine</strong>
      <p>Le devis n'a pas ete envoye car l'API est indisponible pour le moment.</p>
      <ul class="quote-feedback__list">
        <li><span>Nom</span><strong>${payload.customerName || "-"}</strong></li>
        <li><span>Email</span><strong>${payload.email || "-"}</strong></li>
        <li><span>Telephone</span><strong>${payload.phone || "-"}</strong></li>
        <li><span>Date evenement</span><strong>${payload.eventDate || "-"}</strong></li>
        <li><span>Portions</span><strong>${payload.servings || "-"}</strong></li>
        <li><span>Style</span><strong>${payload.style || "-"}</strong></li>
        <li><span>Parfum</span><strong>${payload.flavors.join(", ") || "-"}</strong></li>
      </ul>
    </div>
  `;
}

function formatQuoteSuccess(item) {
  const estimatedPrice = item?.estimatedPrice?.amount;
  const currency = currencyLabel;
  const disclaimer = item?.estimatedPrice?.disclaimer || "";
  const formattedPrice =
    typeof estimatedPrice === "number"
      ? `${estimatedPrice} ${currency}`
      : `En attente ${currency}`;

  return `
    <div class="quote-feedback quote-feedback--success">
      <strong>Demande de devis envoyee avec succes.</strong>
      <p>Nous avons bien recu votre demande et reviendrons vers vous apres validation.</p>
      <ul class="quote-feedback__list">
        <li><span>Reference</span><strong>${item?.id || "-"}</strong></li>
        <li><span>Client</span><strong>${item?.customerName || "-"}</strong></li>
        <li><span>Date evenement</span><strong>${item?.eventDate || "-"}</strong></li>
        <li><span>Prix estime</span><strong>${formattedPrice}</strong></li>
      </ul>
      ${disclaimer ? `<p class="quote-feedback__note">${disclaimer}</p>` : ""}
    </div>
  `;
}

function formatQuoteError(error) {
  return `
    <div class="quote-feedback quote-feedback--error">
      <strong>La demande de devis a echoue.</strong>
      <p>${error.message || "Une erreur est survenue."}</p>
    </div>
  `;
}

function resolveBackendOrigin() {
  const configuredOrigin =
    window.WJ_API_ORIGIN ||
    window.location.origin ||
    document.querySelector('meta[name="wj-api-origin"]')?.content?.trim() ||
    "https://wj-cake-dessert.onrender.com";

  return configuredOrigin.replace(/\/+$/, "");
}

function resolveApiUrl(url) {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const backendOrigin = resolveBackendOrigin();
  return `${backendOrigin}${url.startsWith("/") ? url : `/${url}`}`;
}


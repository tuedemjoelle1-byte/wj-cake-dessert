const apiBase = "/api/v1";

const currencyLabel = "DA";

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
    title: "Anniversaire",
    image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1000&auto=format&fit=crop",
    text: "Gâteaux personnalisés, coffrets et cupcakes festifs pour célébrer avec style."
  },
  {
    title: "Mariage",
    image:
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=1000&auto=format&fit=crop",
    text: "Créations élégantes sur devis pour cérémonies, réceptions et tables raffinées."
  },
  {
    title: "Baby shower",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
    text: "Douceurs pastel, messages personnalisés et coffrets pensés pour les événements tendres."
  },
  {
    title: "Entreprise",
    image:
      "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop",
    text: "Coffrets cadeaux pour équipes, clients et événements professionnels."
  }
];

const reviews = [
  {
    name: "Sarah M.",
    text: "Le coffret était magnifique, très élégant, et la commande était beaucoup plus fluide.",
    rating: 5
  },
  {
    name: "Kevin D.",
    text: "Commande rapide, présentation premium, parfaite pour un anniversaire à Casablanca.",
    rating: 5
  },
  {
    name: "Ines B.",
    text: "Un rendu chic et soigné. La personnalisation et la livraison ont vraiment fait la différence.",
    rating: 5
  }
];

const gallery = [
  "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=900&auto=format&fit=crop"
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
  testsStatus: document.querySelector("#tests-status"),
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
    const [productsResponse, zonesResponse] = await Promise.all([
      fetchJson(`${apiBase}/catalog/products`),
      fetchJson(`${apiBase}/delivery/zones`)
    ]);

    state.apiAvailable = true;
    state.products = productsResponse.items.map(toUiProduct);
    state.zonesCount = zonesResponse.items.length;
    elements.apiStatus.textContent = "Catalogue et livraison connectés au backend W.J. Cake & Dessert.";
  } catch (error) {
    elements.apiStatus.textContent = "API indisponible, affichage du catalogue de démonstration W.J. Cake & Dessert.";
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
  renderTests();
  elements.productsCount.textContent = `${state.products.length} produits`;
  elements.zonesCount.textContent = `${state.zonesCount || 0} zones`;
}

function renderStaticCollections() {
  elements.occasionGrid.innerHTML = occasions
    .map(
      (occasion) => `
        <article class="occasion-card">
          <img src="${occasion.image}" alt="${occasion.title}" />
          <div class="occasion-card__body">
            <h3>${occasion.title}</h3>
            <p>${occasion.text}</p>
          </div>
        </article>
      `
    )
    .join("");

  elements.reviewsGrid.innerHTML = reviews
    .map(
      (review) => `
        <article class="review-card">
          <div class="review-stars">${"★".repeat(review.rating)}</div>
          <p>"${review.text}"</p>
          <strong>${review.name}</strong>
        </article>
      `
    )
    .join("");

  elements.galleryGrid.innerHTML = gallery
    .map(
      (image) => `
        <div class="gallery-item">
          <img src="${image}" alt="Creation W.J. Cake & Dessert" />
        </div>
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
        <img src="${product.image}" alt="${product.name}" />
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

function renderTests() {
  const testResults = runProductFilterTests();
  const allTestsPassed = Object.values(testResults).every(Boolean);
  elements.testsStatus.textContent = allTestsPassed
      ? "Filtrage produits et calcul du configurateur : OK"
    : "Un test de filtrage ou de prix a échoué";
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
    elements.customCakeResult.textContent = formatJson({
      preview: payload,
      note: "API indisponible : devis W.J. Cake & Dessert préparé en mode vitrine."
    });
    return;
  }

  try {
    const result = await fetchJson(`${apiBase}/custom-cakes/quote-requests`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    elements.customCakeResult.textContent = formatJson(result);
  } catch (error) {
    elements.customCakeResult.textContent = formatJson({ error: error.message });
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

function runProductFilterTests() {
  const allProducts = getProductsByCategory(fallbackProducts, "Tous");
  const cupcakeProducts = getProductsByCategory(fallbackProducts, "Cupcakes");
  const cakeProducts = getProductsByCategory(fallbackProducts, "Gateaux");
  const giftProducts = getProductsByCategory(fallbackProducts, "Cadeaux");
  const unknownProducts = getProductsByCategory(fallbackProducts, "Inconnu");
  const configuredCakePrice = calculateCakePrice(12, 4, 8);

  return {
    allProductsCountIsCorrect: allProducts.length === fallbackProducts.length,
    cupcakesOnly:
      cupcakeProducts.length === 2 && cupcakeProducts.every((product) => product.category === "Cupcakes"),
    cakesOnly: cakeProducts.length === 1 && cakeProducts[0].name === "Layer Cake Anniversaire Rose",
    giftsOnly: giftProducts.length === 1 && giftProducts[0].category === "Cadeaux",
    unknownCategoryReturnsEmptyList: unknownProducts.length === 0,
    cakePriceCalculationIsCorrect: configuredCakePrice === 73
  };
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

function resolveBackendOrigin() {
  const configuredOrigin =
    window.WJ_API_ORIGIN ||
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


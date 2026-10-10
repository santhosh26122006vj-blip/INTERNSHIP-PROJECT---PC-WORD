/* ==========================================================================
   PC WORD — Shared Site Script
   Loaded on every page (after products.js). Owns:
     1. Cart storage utilities (shared with cart.js on the cart page)
     2. Cart badge count (shown in the nav on every page)
     3. Toast notifications
     4. Mobile nav toggle
     5. Homepage catalog rendering — search + category filter + grid
   ========================================================================== */

const CART_STORAGE_KEY = 'pcword_cart';

/* --------------------------------------------------------------------------
   1. Cart storage — plain localStorage, shape: [{ id, qty }, ...]
   -------------------------------------------------------------------------- */

/**
 * Read the cart from localStorage. Always returns an array (never null).
 * @returns {{id: string, qty: number}[]}
 */
function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Could not read cart from storage:', err);
    return [];
  }
}

/**
 * Persist the cart and refresh the nav badge.
 * @param {{id: string, qty: number}[]} cart
 */
function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error('Could not save cart to storage:', err);
  }
  updateCartBadge();
}

/**
 * Add a product to the cart, or increase its quantity if already present.
 * @param {string} productId
 * @param {number} qty
 */
function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find((line) => line.id === productId);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }

  saveCart(cart);
}

/**
 * Total number of items in the cart (sum of quantities, not line count).
 * @returns {number}
 */
function getCartItemCount() {
  return getCart().reduce((total, line) => total + line.qty, 0);
}

/* --------------------------------------------------------------------------
   2. Cart badge — kept in sync on every page load and every cart change
   -------------------------------------------------------------------------- */
function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  if (!badge) return;
  const count = getCartItemCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

/* --------------------------------------------------------------------------
   3. Toast notifications — small on-screen confirmation, auto-dismisses
   -------------------------------------------------------------------------- */
let toastTimer = null;

/**
 * Show a short toast message at the bottom of the screen.
 * @param {string} message
 */
function showToast(message) {
  let toast = document.getElementById('siteToast');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

/* --------------------------------------------------------------------------
   4. Mobile nav toggle
   -------------------------------------------------------------------------- */
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  // Close the mobile menu after a link is tapped
  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => links.classList.remove('open'));
  });
}

/* --------------------------------------------------------------------------
   5. Homepage catalog — search, category filter, and grid rendering
   -------------------------------------------------------------------------- */
let activeCategory = 'all';
let activeSearchTerm = '';

/**
 * Build the HTML for a single product card.
 * @param {Product} product
 * @returns {string}
 */
function renderProductCard(product) {
  const discount = product.oldPrice
    ? `<span class="price-sub">${formatINR(product.oldPrice)}</span>`
    : '';

  const stockBadge = product.inStock
    ? '<span class="stock-badge">In Stock</span>'
    : '<span class="stock-badge" style="background:rgba(255,107,107,0.14); color:#ff8a8a; border-color:rgba(255,107,107,0.3);">Out of Stock</span>';

  const buttonAttrs = product.inStock ? '' : 'disabled';
  const buttonLabel = product.inStock ? 'Add to Cart' : 'Notify Me';

  return `
    <article class="product-card fade-up">
      <div class="product-thumb">
        ${stockBadge}
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
      </div>
      <div class="product-body">
        <span class="product-category">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <span class="product-spec">${product.spec}</span>
        <div class="product-footer">
          <div class="stack gap-1">
            <span class="price">${formatINR(product.price)}</span>
            ${discount}
          </div>
          <button class="btn btn-primary btn-sm" data-add-to-cart="${product.id}" ${buttonAttrs}>
            ${buttonLabel}
          </button>
        </div>
      </div>
    </article>
  `;
}

/**
 * Apply the active category + search term and re-render the grid.
 */
function renderCatalog() {
  const grid = document.getElementById('productGrid');
  const resultCount = document.getElementById('resultCount');
  if (!grid) return; // Not on a page with a catalog

  const term = activeSearchTerm.trim().toLowerCase();

  const filtered = PRODUCTS.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.categorySlug === activeCategory;
    const matchesSearch =
      term === '' ||
      product.name.toLowerCase().includes(term) ||
      product.spec.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  if (resultCount) {
    resultCount.textContent = `${filtered.length} item${filtered.length === 1 ? '' : 's'}`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <span class="eyebrow">No matches</span>
        <p>Try a different search term or category.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(renderProductCard).join('');
}

/**
 * Wire up the search input and category chip clicks on the catalog page.
 */
function initCatalogControls() {
  const grid = document.getElementById('productGrid');
  if (!grid) return; // Only run this on pages with a catalog

  const searchInput = document.getElementById('searchInput');
  const categoryRail = document.getElementById('categoryRail');

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      activeSearchTerm = event.target.value;
      renderCatalog();
    });
  }

  if (categoryRail) {
    categoryRail.addEventListener('click', (event) => {
      const chip = event.target.closest('[data-category]');
      if (!chip) return;

      categoryRail.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.dataset.category;
      renderCatalog();
    });
  }

  // Event delegation for "Add to Cart" buttons — grid is re-rendered often
  grid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add-to-cart]');
    if (!button || button.disabled) return;

    const productId = button.dataset.addToCart;
    const product = getProductById(productId);
    if (!product) return;

    addToCart(productId, 1);
    showToast(`${product.name} added to cart`);
  });

  renderCatalog();
}

/* --------------------------------------------------------------------------
   Init — runs on every page once the DOM is ready
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initNavToggle();
  initCatalogControls();
});

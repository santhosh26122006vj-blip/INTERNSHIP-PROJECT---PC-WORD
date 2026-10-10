/* ==========================================================================
   PC WORD — Cart Page Script
   Runs only on cart.html. Depends on js/products.js (PRODUCTS, formatINR,
   getProductById) and js/script.js (getCart, saveCart) being loaded first.
   ========================================================================== */

/**
 * Build the list of cart lines joined with their product data.
 * Silently drops any cart entry whose product no longer exists.
 * @returns {{product: Product, qty: number}[]}
 */
function getCartLines() {
  return getCart()
    .map((line) => {
      const product = getProductById(line.id);
      return product ? { product, qty: line.qty } : null;
    })
    .filter(Boolean);
}

/**
 * Current cart subtotal (== total, since shipping is free).
 * Shared with js/checkout.js when the order is placed.
 * @returns {number}
 */
function getCartTotal() {
  return getCartLines().reduce((sum, line) => sum + line.product.price * line.qty, 0);
}

/**
 * Build the HTML for one cart row.
 * @param {{product: Product, qty: number}} line
 * @returns {string}
 */
function renderCartRow(line) {
  const { product, qty } = line;
  const lineTotal = product.price * qty;

  return `
    <div class="cart-row" data-cart-row="${product.id}">
      <div class="thumb">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="info">
        <div class="name">${product.name}</div>
        <div class="cat">${product.category}</div>
        <div class="qty-stepper" style="margin-top: 8px;">
          <button type="button" data-qty-decrease="${product.id}" aria-label="Decrease quantity">−</button>
          <span class="qty-val">${qty}</span>
          <button type="button" data-qty-increase="${product.id}" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div class="line-total">${formatINR(lineTotal)}</div>
      <button type="button" class="remove-link" data-remove-item="${product.id}">Remove</button>
    </div>
  `;
}

/**
 * Re-render the entire cart section: rows, totals, and empty/full state.
 */
function renderCart() {
  const cartList = document.getElementById('cartList');
  const emptyMessage = document.getElementById('emptyCartMessage');
  const cartContent = document.getElementById('cartContent');
  if (!cartList) return; // Not on the cart page

  const lines = getCartLines();

  if (lines.length === 0) {
    emptyMessage.style.display = 'block';
    cartContent.style.display = 'none';
    return;
  }

  emptyMessage.style.display = 'none';
  cartContent.style.display = 'grid';

  cartList.innerHTML = lines.map(renderCartRow).join('');

  const itemCount = lines.reduce((sum, line) => sum + line.qty, 0);
  const total = getCartTotal();

  document.getElementById('itemCountLabel').textContent = itemCount;
  document.getElementById('subtotalValue').textContent = formatINR(total);
  document.getElementById('totalValue').textContent = formatINR(total);
}

/**
 * Update a single line's quantity (removes the line if it drops to 0).
 * @param {string} productId
 * @param {number} delta
 */
function changeQty(productId, delta) {
  const cart = getCart();
  const line = cart.find((l) => l.id === productId);
  if (!line) return;

  line.qty += delta;

  const nextCart = line.qty <= 0 ? cart.filter((l) => l.id !== productId) : cart;
  saveCart(nextCart);
  renderCart();
}

/**
 * Remove a line from the cart entirely.
 * @param {string} productId
 */
function removeFromCart(productId) {
  const cart = getCart().filter((l) => l.id !== productId);
  saveCart(cart);
  renderCart();
}

/**
 * Wire up quantity/remove buttons using event delegation, since rows
 * are re-rendered on every change.
 */
function initCartControls() {
  const cartList = document.getElementById('cartList');
  if (!cartList) return;

  cartList.addEventListener('click', (event) => {
    const decreaseBtn = event.target.closest('[data-qty-decrease]');
    const increaseBtn = event.target.closest('[data-qty-increase]');
    const removeBtn = event.target.closest('[data-remove-item]');

    if (decreaseBtn) changeQty(decreaseBtn.dataset.qtyDecrease, -1);
    if (increaseBtn) changeQty(increaseBtn.dataset.qtyIncrease, 1);
    if (removeBtn) removeFromCart(removeBtn.dataset.removeItem);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCartControls();
  renderCart();
});

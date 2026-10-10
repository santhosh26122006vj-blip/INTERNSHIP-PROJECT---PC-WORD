import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

const VALIDATORS = {
  fullName: (v) => v.trim().length >= 2 || 'Enter your full name.',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.',
  phone: (v) => /^[6-9]\d{9}$/.test(v.trim()) || 'Enter a valid 10-digit phone number.',
  address: (v) => v.trim().length >= 5 || 'Enter your delivery address.',
  city: (v) => v.trim().length >= 2 || 'Enter your city.',
  state: (v) => v.trim().length >= 2 || 'Enter your state.',
  pincode: (v) => /^\d{6}$/.test(v.trim()) || 'Enter a valid 6-digit PIN code.'
};
const form = document.getElementById('checkoutForm');
const btn = document.getElementById('placeOrderBtn');
let signedInUser = null;
let authReady = false;

function validate(form) {
  let valid = true; const values = {};
  Object.keys(VALIDATORS).forEach((key) => {
    const input = form.elements[key]; const error = form.querySelector(`[data-error-for="${key}"]`);
    const value = input?.value || ''; values[key] = value.trim();
    const result = VALIDATORS[key](value);
    if (result !== true) { valid = false; if (error) error.textContent = result; input.style.borderColor = 'var(--danger)'; }
    else { if (error) error.textContent = ''; input.style.borderColor = ''; }
  });
  values.additionalInfo = (form.elements.additionalInfo?.value || '').trim();
  return { valid, values };
}
function updateCheckoutAccess() {
  if (!btn) return;
  if (!authReady) { btn.disabled = true; btn.textContent = 'Checking Sign In…'; return; }
  if (!signedInUser) { btn.disabled = false; btn.textContent = 'Sign In to Place Order'; return; }
  btn.disabled = false; btn.textContent = 'Place Order';
}
onAuthStateChanged(auth, (user) => { signedInUser = user; authReady = true; updateCheckoutAccess(); });
if (form) {
  Object.keys(VALIDATORS).forEach((key) => form.elements[key]?.addEventListener('input', () => {
    const error = form.querySelector(`[data-error-for="${key}"]`); if (error) error.textContent = ''; form.elements[key].style.borderColor = '';
  }));
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!authReady) return window.showToast?.('Please wait while we check your sign-in.');
    if (!signedInUser) { location.href = 'login.html?return=cart.html'; return; }
    const { valid, values } = validate(form);
    if (!valid) { window.showToast?.('Please fix the highlighted fields.'); return; }
    const lines = window.getCartLines();
    if (!lines.length) { window.showToast?.('Your cart is empty.'); return; }
    const total = window.getCartTotal();
    const itemCount = lines.reduce((sum, line) => sum + line.qty, 0);
    btn.disabled = true; btn.textContent = 'Placing Order…';
    try {
      const profileSnap = await getDoc(doc(db, 'customers', signedInUser.uid));
      const profile = profileSnap.exists() ? profileSnap.data() : {};
      const orderData = {
        userId: signedInUser.uid,
        customer: { fullName: values.fullName, email: signedInUser.email || values.email, phone: values.phone, address: values.address, city: values.city, state: values.state, pincode: values.pincode, additionalInfo: values.additionalInfo || null },
        items: lines.map((line) => ({ productId: String(line.product.id), name: line.product.name, category: line.product.category, unitPrice: Number(line.product.price), quantity: Number(line.qty), lineTotal: Number(line.product.price * line.qty) })),
        itemCount, totalPrice: Number(total), status: 'Placed', orderDate: serverTimestamp(), customerName: profile.name || values.fullName
      };
      await addDoc(collection(db, 'orders'), orderData);
      window.saveCart([]);
      document.getElementById('cartContent').style.display = 'none';
      document.getElementById('emptyCartMessage').style.display = 'none';
      document.getElementById('orderSuccessDetail').textContent = `Thanks, ${values.fullName}! Your order of ${itemCount} item${itemCount === 1 ? '' : 's'} (${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(total)}) has been placed.`;
      document.getElementById('orderSuccess').style.display = 'block';
    } catch (err) {
      console.error('Failed to save order to Firestore:', err);
      window.showToast?.(err.code === 'permission-denied' ? 'Firestore denied this order. Check the published rules.' : 'Could not place your order. Check your connection and try again.');
      btn.disabled = false; updateCheckoutAccess();
    }
  });
}

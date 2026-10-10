import {
  onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, sendPasswordResetEmail,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import {
  doc, getDoc, setDoc, updateDoc, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { auth, db } from './firebase-config.js';

const $ = (id) => document.getElementById(id);
const setMessage = (id, message, success = false) => {
  const el = $(id);
  if (!el) return;
  el.textContent = message;
  el.style.color = success ? 'var(--success)' : 'var(--danger)';
};
const cleanError = (err) => {
  const messages = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/weak-password': 'Use a password with at least 6 characters.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/user-not-found': 'No account was found with this email.',
    'auth/wrong-password': 'Incorrect email or password.',
    'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
    'auth/network-request-failed': 'Network error. Check your internet connection.',
    'permission-denied': 'Firebase permissions blocked this action. Check your Firestore rules.'
  };
  return messages[err?.code] || err?.message || 'Something went wrong. Please try again.';
};

export async function getUserProfile(user = auth.currentUser) {
  if (!user) return null;
  const snap = await getDoc(doc(db, 'customers', user.uid));
  return snap.exists() ? snap.data() : { name: user.displayName || '', email: user.email || '', phone: '' };
}

async function initNav(user) {
  const link = $('authNavLink');
  if (!link) return;
  if (user) {
    let name = user.displayName || user.email?.split('@')[0] || 'Account';
    try { const profile = await getUserProfile(user); name = profile?.name || name; } catch (e) { console.warn('Could not load profile for navigation', e); }
    link.textContent = name.split(' ')[0];
    link.href = 'profile.html';
  } else {
    link.textContent = 'Sign In';
    link.href = 'login.html';
  }
}

onAuthStateChanged(auth, async (user) => {
  await initNav(user);
  const protectedPage = ['profile.html', 'edit-profile.html'].some((p) => location.pathname.endsWith('/' + p));
  if (protectedPage && !user) {
    location.href = 'login.html?return=' + encodeURIComponent(location.pathname.split('/').pop());
    return;
  }
  if ($('profileName') && user) {
    try {
      const p = await getUserProfile(user);
      $('profileName').textContent = p?.name || user.displayName || '—';
      $('profileEmail').textContent = user.email || '—';
      $('profilePhone').textContent = p?.phone || '—';
    } catch (e) { setMessage('profileMessage', cleanError(e)); }
  }
  if ($('editProfileForm') && user) {
    try {
      const p = await getUserProfile(user);
      const form = $('editProfileForm');
      form.elements.name.value = p?.name || user.displayName || '';
      form.elements.email.value = user.email || '';
      form.elements.phone.value = p?.phone || '';
    } catch (e) { setMessage('editError', cleanError(e)); }
  }
  if ($('checkoutForm') && user) {
    try {
      const p = await getUserProfile(user);
      const f = $('checkoutForm');
      if (!f.elements.fullName.value) f.elements.fullName.value = p?.name || user.displayName || '';
      if (!f.elements.email.value) f.elements.email.value = user.email || '';
      if (!f.elements.phone.value) f.elements.phone.value = p?.phone || '';
    } catch (e) { console.warn('Could not prefill checkout profile', e); }
  }
});

const signupForm = $('signupForm');
if (signupForm) signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  setMessage('authError', '');
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim().toLowerCase();
  const phone = form.elements.phone.value.trim();
  const password = form.elements.password.value;
  const confirm = form.elements.confirmPassword.value;
  if (name.length < 2) return setMessage('authError', 'Enter your full name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setMessage('authError', 'Enter a valid email address.');
  if (!/^[6-9]\d{9}$/.test(phone)) return setMessage('authError', 'Enter a valid 10-digit Indian mobile number.');
  if (password.length < 6) return setMessage('authError', 'Password must contain at least 6 characters.');
  if (password !== confirm) return setMessage('authError', 'Passwords do not match.');
  const button = form.querySelector('[type="submit"]');
  if (button) { button.disabled = true; button.textContent = 'Creating Account…'; }
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    await setDoc(doc(db, 'customers', credential.user.uid), {
      uid: credential.user.uid, name, email, phone, createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    });
    location.href = 'homepage.html';
  } catch (err) {
    console.error('Signup failed:', err);
    setMessage('authError', cleanError(err));
    if (button) { button.disabled = false; button.textContent = 'Create Account'; }
  }
});

const loginForm = $('loginForm');
if (loginForm) loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  setMessage('authError', '');
  const email = form.elements.email.value.trim().toLowerCase();
  const password = form.elements.password.value;
  if (!email || !password) return setMessage('authError', 'Enter your email and password.');
  const button = form.querySelector('[type="submit"]');
  if (button) { button.disabled = true; button.textContent = 'Signing In…'; }
  try {
    await signInWithEmailAndPassword(auth, email, password);
    const target = new URLSearchParams(location.search).get('return');
    location.href = target === 'cart.html' ? 'cart.html' : 'homepage.html';
  } catch (err) {
    console.error('Login failed:', err);
    setMessage('authError', cleanError(err));
    if (button) { button.disabled = false; button.textContent = 'Sign In'; }
  }
});

const logoutBtn = $('logoutBtn');
if (logoutBtn) logoutBtn.addEventListener('click', async () => {
  try { await signOut(auth); location.href = 'index.html'; }
  catch (err) { setMessage('profileMessage', cleanError(err)); }
});

const editForm = $('editProfileForm');
if (editForm) editForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const user = auth.currentUser;
  if (!user) return location.href = 'login.html';
  const name = editForm.elements.name.value.trim();
  const phone = editForm.elements.phone.value.trim();
  if (name.length < 2) return setMessage('editError', 'Enter your full name.');
  if (!/^[6-9]\d{9}$/.test(phone)) return setMessage('editError', 'Enter a valid 10-digit Indian mobile number.');
  const button = editForm.querySelector('[type="submit"]');
  if (button) { button.disabled = true; button.textContent = 'Saving…'; }
  try {
    await updateProfile(user, { displayName: name });
    await setDoc(doc(db, 'customers', user.uid), { uid: user.uid, name, email: user.email, phone, updatedAt: serverTimestamp() }, { merge: true });
    location.href = 'profile.html';
  } catch (err) {
    setMessage('editError', cleanError(err));
    if (button) { button.disabled = false; button.textContent = 'Save Changes'; }
  }
});

const forgotForm = $('forgotForm');
if (forgotForm) forgotForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = forgotForm.elements.email.value.trim().toLowerCase();
  if (!email) return setMessage('forgotMessage', 'Enter your account email.');
  const button = forgotForm.querySelector('[type="submit"]');
  if (button) { button.disabled = true; button.textContent = 'Sending…'; }
  try {
    await sendPasswordResetEmail(auth, email);
    setMessage('forgotMessage', 'If an account exists for this email, Firebase has sent a password reset link. Check your inbox and spam folder.', true);
  } catch (err) {
    setMessage('forgotMessage', cleanError(err));
  } finally {
    if (button) { button.disabled = false; button.textContent = 'Send Reset Link'; }
  }
});

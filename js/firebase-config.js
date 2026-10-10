/* PC Word Firebase setup: Authentication + Firestore. */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyCVHyontmnJJMVxqMeqCloaa6lRJqcGm3Y",
  authDomain: "pc-word-8e288.firebaseapp.com",
  projectId: "pc-word-8e288",
  storageBucket: "pc-word-8e288.firebasestorage.app",
  messagingSenderId: "327475844200",
  appId: "1:327475844200:web:0177b286fb4d0db2c597dd"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

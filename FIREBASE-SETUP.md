# PC Word — Firebase setup

This version uses Firebase Authentication for real sign-up/sign-in and Cloud Firestore for customer profiles and orders.

## One-time Firebase Console setup
1. Open the Firebase project `pc-word-8e288` (or update `js/firebase-config.js` to your own web-app config).
2. Authentication → Sign-in method → enable **Email/Password**.
3. Firestore Database → Rules → paste the contents of `firestore.rules` and Publish.
4. Use the site through VS Code Live Server or another HTTP(S) host. Do not open HTML files directly with `file://`.
5. Create a new test account, then verify it appears in Authentication → Users and Firestore → `customers/{uid}`.
6. Place a test order while signed in; it should appear in `orders` with `userId` equal to that user's Firebase UID.

## Data model
- Firebase Authentication stores login credentials securely. Passwords are not stored in Firestore or browser localStorage.
- `customers/{uid}` stores name, email, phone, and timestamps. A customer can access only their own profile document.
- `orders/{orderId}` stores the customer delivery details, items, total, status, timestamp, and owner UID. Customers can read only their own orders and cannot modify/delete saved orders directly.
- Cart contents remain in browser localStorage as a convenience; they are not account credentials.

## Important security notes
- These are client-side demo-store rules. For a real store, prices and stock must be verified by a trusted backend/Cloud Function; a browser can alter cart prices before submitting.
- Existing demo accounts saved in old localStorage are not migrated. Customers must sign up again with Firebase Authentication.
- If Firebase Console shows `auth/operation-not-allowed`, enable Email/Password in Authentication settings.

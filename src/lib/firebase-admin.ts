// src/lib/firebase-admin.ts
// Firebase ADMIN SDK — server-side only
// Used in API routes to verify ID tokens and set custom claims

import { initializeApp, getApps, getApp, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

declare global {
  // eslint-disable-next-line no-var
  var _firebaseAdminApp: App | undefined;
}

function initFirebaseAdmin(): App {
  // Return cached app if already initialized
  if (global._firebaseAdminApp) return global._firebaseAdminApp;
  if (getApps().length > 0) {
    global._firebaseAdminApp = getApp();
    return global._firebaseAdminApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || "khata-ai-bd55b";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  let app: App;

  if (!clientEmail || !privateKey) {
    console.warn(
      "⚠️  Firebase Admin: FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY not set.\n" +
        "   Download the service account JSON from:\n" +
        "   Firebase Console → Project Settings → Service Accounts → Generate new private key\n" +
        "   Then add FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY to .env.local\n" +
        "   Token verification will NOT work until credentials are added."
    );
    app = initializeApp({ projectId });
  } else {
    app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        // Replace escaped newlines — common issue pasting private key into .env
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
    });
    console.log("✅ Firebase Admin SDK initialized with service account");
  }

  global._firebaseAdminApp = app;
  return app;
}

let adminApp: App | undefined;
let adminAuthInstance: any = null;

try {
  adminApp = initFirebaseAdmin();
} catch (err) {
  console.warn("⚠️ initFirebaseAdmin caught error:", err);
}

export const adminAuth = new Proxy({} as any, {
  get(_target, prop) {
    if (!adminAuthInstance) {
      try {
        if (!adminApp) adminApp = initFirebaseAdmin();
        if (adminApp) adminAuthInstance = getAuth(adminApp);
      } catch (e) {
        console.warn("⚠️ Firebase Admin Auth proxy initialization skipped:", e);
      }
    }
    if (!adminAuthInstance) {
      return async () => {
        throw new Error("Firebase Admin Auth is not configured on this environment.");
      };
    }
    const val = adminAuthInstance[prop];
    return typeof val === "function" ? val.bind(adminAuthInstance) : val;
  },
});

export { adminApp };
export default adminApp;

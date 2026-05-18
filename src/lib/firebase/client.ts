import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

function firebaseConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!apiKey || !projectId) return null;

  return {
    apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

export async function initFirebase(): Promise<{ app: FirebaseApp; analytics: Analytics | null } | null> {
  const config = firebaseConfig();
  if (!config) return null;

  const app = getApps().length > 0 ? getApps()[0]! : initializeApp(config);
  const analytics = (await isSupported()) ? getAnalytics(app) : null;
  return { app, analytics };
}

"use client";

import { useEffect } from "react";

/** Initializes Firebase Analytics in production when public env vars are set. */
export function FirebaseAnalytics() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;

    void import("@/lib/firebase/client").then(({ initFirebase }) => initFirebase());
  }, []);

  return null;
}

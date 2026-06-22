"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAnalytics,
  isSupported,
  logEvent,
  type Analytics,
  type CustomParams,
} from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let analyticsPromise: Promise<Analytics | null> | undefined;

export function isFirebaseAnalyticsConfigured() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId &&
      firebaseConfig.measurementId,
  );
}

export function getFirebaseAnalytics() {
  if (typeof window === "undefined" || !isFirebaseAnalyticsConfigured()) {
    return Promise.resolve(null);
  }

  analyticsPromise ??= isSupported()
    .then((supported) => {
      if (!supported) {
        return null;
      }

      const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      return getAnalytics(app);
    })
    .catch(() => null);

  return analyticsPromise;
}

export async function logFirebaseEvent(
  eventName: string,
  eventParams?: CustomParams,
) {
  const analytics = await getFirebaseAnalytics();

  if (!analytics) {
    return;
  }

  logEvent(analytics, eventName, eventParams);
}

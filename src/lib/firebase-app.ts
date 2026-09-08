import { getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain:
    typeof window !== "undefined" && window.location.hostname === "hugoalen.vercel.app"
      ? "hugoalen.vercel.app"
      : import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

const missingEntries = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingEntries.length > 0) {
  throw new Error(`Missing Firebase environment variables: ${missingEntries.join(", ")}`);
}

export const firebaseApp = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDeVpB7q62_ZZ8Ry4i3wJXM2FnqDHaYGUw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "eternia-waitlist.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "eternia-waitlist",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "eternia-waitlist.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "602466610121",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:602466610121:web:eb7ea13d415797ac025618",
};

let db: Firestore | null = null;

try {
  // Only initialize if the project ID is available to avoid throwing on empty values
  if (firebaseConfig.projectId) {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
  } else {
    console.warn(
      "Firebase Project ID is missing in environment variables. Real-time counter will fall back to local database count."
    );
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { db };

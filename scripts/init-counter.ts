import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function initCounter() {
  if (!firebaseConfig.projectId) {
    console.error("Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing in .env file.");
    process.exit(1);
  }

  console.log("Initializing Firebase with project:", firebaseConfig.projectId);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const docRef = doc(db, "waitlist", "counter");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Counter document already exists. Current data:", docSnap.data());
  } else {
    console.log("Counter document does not exist. Initializing with count = 243...");
    await setDoc(docRef, { count: 243 });
    console.log("Counter document successfully initialized with count = 243!");
  }
}

initCounter().catch((err) => {
  console.error("Failed to initialize counter document:", err);
});


// Try to load dotenv if available (optional dependency)
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not installed, assume env vars are set manually
}

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

console.log("Config:", { projectId: firebaseConfig.projectId || "Not set" });

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error("Missing Firebase configuration. Please set environment variables:");
    console.error("  NEXT_PUBLIC_FIREBASE_API_KEY");
    console.error("  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
    console.error("  NEXT_PUBLIC_FIREBASE_PROJECT_ID");
    console.error("  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
    console.error("  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
    console.error("  NEXT_PUBLIC_FIREBASE_APP_ID");
    console.error("\nCreate a .env.local file in the portfolio/ directory with these variables.");
    process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkAchievements() {
    console.log("Fetching achievements...");
    try {
        const querySnapshot = await getDocs(collection(db, "achievements"));
        console.log(`Found ${querySnapshot.size} achievements.`);
        querySnapshot.forEach(doc => {
            console.log(doc.id, doc.data());
        });
    } catch (e) {
        console.error("Error:", e);
    }
}

checkAchievements();

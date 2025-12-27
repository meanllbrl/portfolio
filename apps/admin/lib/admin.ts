import "server-only";
import { getApps, initializeApp, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Initialize Firebase Admin
// This requires the FIREBASE_ADMIN_SDK_KEY environment variable to be set.
// It should contain the full JSON content of your service account key.

let adminApp;

try {
    if (getApps().length === 0) {
        if (process.env.FIREBASE_ADMIN_SDK_KEY) {
            // Parse the JSON string from environment variable
            let serviceAccount;
            try {
                serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_KEY);
            } catch (e) {
                // Handle cases where newlines might be escaped incorrectly
                console.warn("Failed to parse FIREBASE_ADMIN_SDK_KEY, trying to fix newlines");
                const fixedKey = process.env.FIREBASE_ADMIN_SDK_KEY.replace(/\\n/g, '\n');
                serviceAccount = JSON.parse(fixedKey);
            }

            adminApp = initializeApp({
                credential: cert(serviceAccount),
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
            });
        } else {
            console.error("FIREBASE_ADMIN_SDK_KEY is missing. Admin writes will fail.");
        }
    } else {
        adminApp = getApp();
    }
} catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
}

export const adminDb = adminApp ? getFirestore(adminApp) : null;
export const adminStorage = adminApp ? getStorage(adminApp) : null;

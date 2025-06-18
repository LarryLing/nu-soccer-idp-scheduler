import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import dotenv from "dotenv";

dotenv.config();

if (
    !process.env.FIREBASE_PRIVATE_KEY ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !process.env.FIREBASE_PROJECT_ID
) {
    throw new Error(
        "Missing Firebase Admin credentials in environment variables",
    );
}

const adminApp = admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
});

const adminAuth = getAuth(adminApp);

export { adminApp, adminAuth };

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

if (
    !import.meta.env.VITE_FIREBASE_API_KEY ||
    !import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    !import.meta.env.VITE_FIREBASE_PROJECT_ID ||
    !import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    !import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    !import.meta.env.VITE_FIREBASE_MESSAGING_APP_ID
) {
    throw new Error(
        "Missing Firebase Client credentials in environment variables",
    );
}

const clientApp = initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_MESSAGING_APP_ID,
});

const clientAuth = getAuth(clientApp);

export { clientApp, clientAuth };

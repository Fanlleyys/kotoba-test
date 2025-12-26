import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDYxerYUz36RVqLzHymld155pH65OoZUNo",
    authDomain: "kotoba-f335d.firebaseapp.com",
    projectId: "kotoba-f335d",
    storageBucket: "kotoba-f335d.firebasestorage.app",
    messagingSenderId: "159368872578",
    appId: "1:159368872578:web:3f2614195804aa785e6a9b",
    measurementId: "G-XCSQS051B3"
};

// Deep Link Configuration for Capacitor APK
export const DEEP_LINK_CONFIG = {
    scheme: 'katasensei',      // Custom URL scheme: katasensei://
    host: 'auth',              // Host: katasensei://auth/
    callbackPath: 'callback',  // Full: katasensei://auth/callback
};

// Build the redirect URL based on environment
const getRedirectUrl = (): string | undefined => {
    // Check if running in Capacitor
    if (typeof window !== 'undefined') {
        const url = document.URL;

        // In Capacitor app, use deep link
        if (url.startsWith('capacitor://') ||
            url.startsWith('ionic://') ||
            (window as any).Capacitor !== undefined) {
            return `${DEEP_LINK_CONFIG.scheme}://${DEEP_LINK_CONFIG.host}/${DEEP_LINK_CONFIG.callbackPath}`;
        }
    }

    // For web, use default (undefined = current domain)
    return undefined;
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth with custom redirect URL for Capacitor
export const auth = getAuth(app);

// Configure Google Provider with custom parameters
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Firestore
export const db = getFirestore(app);

// Export redirect URL for use in auth context
export const deepLinkRedirectUrl = getRedirectUrl();

export default app;

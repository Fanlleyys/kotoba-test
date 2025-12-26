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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore
export const db = getFirestore(app);

export default app;

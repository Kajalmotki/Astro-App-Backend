// Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDeROxeSW1DiT1NRGAck1VS-1BxD38k370",
    authDomain: "astrorevo-5fb79.firebaseapp.com",
    projectId: "astrorevo-5fb79",
    storageBucket: "astrorevo-5fb79.firebasestorage.app",
    messagingSenderId: "923686540380",
    appId: "1:923686540380:web:75a2706655241527338299",
    measurementId: "G-K6FBT32F10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, db, googleProvider };

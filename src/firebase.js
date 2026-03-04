// Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBPiGv0gZBYA3Ik_crdSnjVf9cVJXlxvNk",
    authDomain: "astrorevo-app-backend.firebaseapp.com",
    projectId: "astrorevo-app-backend",
    storageBucket: "astrorevo-app-backend.firebasestorage.app",
    messagingSenderId: "844264360904",
    appId: "1:844264360904:web:c7b51a589b6d0751894efd",
    measurementId: "G-Z4F2H0968J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, db, googleProvider };

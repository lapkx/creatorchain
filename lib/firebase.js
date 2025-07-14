// lib/firebase.js

// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAWUw_hES4CS6F18kJ7bzYSoWoYEcOcBMk",
  authDomain: "creatorchainx.firebaseapp.com",
  projectId: "creatorchainx",
  storageBucket: "creatorchainx.firebasestorage.app",
  messagingSenderId: "33389929230",
  appId: "1:33389929230:web:9bb5afb2567973be0c6d5f",
  measurementId: "G-RPPVKP79SJ"
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Initialize Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// ❌ Omit analytics for now (causes SSR issues in Next.js)
// import { getAnalytics } from "firebase/analytics";
// const analytics = getAnalytics(app);

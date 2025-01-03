import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAOEEfCBv3igfPZbhFyP-TVdIrRhq-QBuo",
  authDomain: "library-booking-system-fc994.firebaseapp.com",
  projectId: "library-booking-system-fc994",
  storageBucket: "library-booking-system-fc994.firebasestorage.app",
  messagingSenderId: "204151982629",
  appId: "1:204151982629:web:be6be44d960f8dd4868dcc",
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

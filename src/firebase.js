import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// Verify if the critical configuration variables are set
export const isFirebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

let authInstance = null;
let googleProviderInstance = null;
let githubProviderInstance = null;

if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    googleProviderInstance = new GoogleAuthProvider();
    githubProviderInstance = new GithubAuthProvider();
  } catch (error) {
    console.error("Firebase App initialization failed:", error);
  }
}

export const auth = authInstance;
export const googleProvider = googleProviderInstance;
export const githubProvider = githubProviderInstance;

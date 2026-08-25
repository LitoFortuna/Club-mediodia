// Firebase client SDK — para uso en el navegador y SSR sin Admin privileges
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCegNuNQasDiQ66YZ6R9lMKdla9GBo1C-8",
  authDomain: "terraza-sonora.firebaseapp.com",
  projectId: "terraza-sonora",
  storageBucket: "terraza-sonora.firebasestorage.app",
  messagingSenderId: "573822769419",
  appId: "1:573822769419:web:f6912a5bc1129b807daa0e",
};

// Evita re-inicializar en SSR / hot reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);

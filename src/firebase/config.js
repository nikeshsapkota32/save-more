// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBxbgiGIa1jdTSvlM4Vefc7VLSbwnn71Hc",
  authDomain: "savetheplate-e7452.firebaseapp.com",
  projectId: "savetheplate-e7452",
  storageBucket: "savetheplate-e7452.firebasestorage.app",
  messagingSenderId: "231875099264",
  appId: "1:231875099264:web:b2b0a3c84f90f1baca0465",
  measurementId: "G-61CG2WV5Z3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


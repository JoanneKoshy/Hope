import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCA7CF2nWyByEARrjn8FWq-bWkfwochCZ8",
  authDomain: "hope-ad53b.firebaseapp.com",
  projectId: "hope-ad53b",
  storageBucket: "hope-ad53b.firebasestorage.app",
  messagingSenderId: "491105114841",
  appId: "1:491105114841:web:be0e8e1f0017f936d37cc8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

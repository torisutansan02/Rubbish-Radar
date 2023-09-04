import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBB4f_3EHS2eZBlHRjzqnvRF_dFQbImx00",
  authDomain: "rubbishradar-695ae.firebaseapp.com",
  projectId: "rubbishradar-695ae",
  storageBucket: "rubbishradar-695ae.appspot.com",
  messagingSenderId: "720087308564",
  appId: "1:720087308564:web:b86313fc82f439e53cca01",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

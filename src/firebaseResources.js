import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqZEfUpxfeXhL6bmG1JzKsw7QRCt-YuRg",
  authDomain: "rubbishradartristan.firebaseapp.com",
  projectId: "rubbishradartristan",
  storageBucket: "rubbishradartristan.appspot.com",
  messagingSenderId: "683691306537",
  appId: "1:683691306537:web:b117f52f0de08a2906b638",
  measurementId: "G-52BTD03K1B",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

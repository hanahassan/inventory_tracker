// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEJGtpgX4uQqRmnMiqD8BEg0AkHyW0BYE",
  authDomain: "inventory-management-5aefa.firebaseapp.com",
  projectId: "inventory-management-5aefa",
  storageBucket: "inventory-management-5aefa.appspot.com",
  messagingSenderId: "468336267457",
  appId: "1:468336267457:web:d4267efb6644085821c440",
  measurementId: "G-M49FBXX4BP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

export {firestore, storage}
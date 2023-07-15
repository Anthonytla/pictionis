// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXdojIg8_vpbQ1ZBdhwF-a97ZLF9u7MEQ",
  authDomain: "pictionis2-9336c.firebaseapp.com",
  databaseURL:
    "https://pictionis2-9336c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pictionis2-9336c",
  storageBucket: "pictionis2-9336c.appspot.com",
  messagingSenderId: "129193830243",
  appId: "1:129193830243:web:08518bb1516271b012d556",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQMaYKy5ya-xkUv2XdJKPWI9ZjkLzTVoo",
  authDomain: "speak-n-chat.firebaseapp.com",
  projectId: "speak-n-chat",
  storageBucket: "speak-n-chat.appspot.com",
  messagingSenderId: "1051788113268",
  appId: "1:1051788113268:web:aee29fb092a52be7c7e821",
  measurementId: "G-WS5MFR3F8L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export { app, database };
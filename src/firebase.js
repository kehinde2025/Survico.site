// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// ✅ Your config
const firebaseConfig = {
  apiKey: "AIzaSyBvDSAf3hQG0KhDKj-qdQG7WelE2ThDWds",
  authDomain: "survico-8d596.firebaseapp.com",
  projectId: "survico-8d596",
  storageBucket: "survico-8d596.firebasestorage.app",
  messagingSenderId: "422685223247",
  appId: "1:422685223247:web:6b0596ecfcaf5a7d8bbd3a",
  measurementId: "G-7EDPFET2W1"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Setup Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ✅ Export them!
export { auth, provider };

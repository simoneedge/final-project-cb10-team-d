import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Importa Firestore

// Configurazione Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBYY9bA6zqPcCYoFEhLkAK18UTOYJ3TvH0",
  authDomain: "sicilipulse.firebaseapp.com",
  projectId: "sicilipulse",
  storageBucket: "sicilipulse.appspot.com",
  messagingSenderId: "459360140003",
  appId: "1:459360140003:web:b0c0571ad5e4e455d363d6",
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Ottieni l'istanza di autenticazione
const auth = getAuth(app);

// Ottieni l'istanza di Firestore
const db = getFirestore(app); // Inizializza Firestore

export { auth, db }; // Esporta sia auth che db

// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Configuração do Firebase (sua)
const firebaseConfig = {
  apiKey: "AIzaSyDKUmxq080QG21a176OWeScTjoNe6UJZAQ",
  authDomain: "teste-213da.firebaseapp.com",
  databaseURL: "https://teste-213da-default-rtdb.firebaseio.com",
  projectId: "teste-213da",
  storageBucket: "teste-213da.firebasestorage.app",
  messagingSenderId: "907703857578",
  appId: "1:907703857578:web:0aa5a644c662e62f82fbd3",
  measurementId: "G-18ZN6NGY82" // pode deixar aqui, mas não será usado
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Realtime Database
const database = getDatabase(app);

export { database };
// adicionando o auth
export const auth = getAuth(app);
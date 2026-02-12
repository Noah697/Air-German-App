import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Firestore importieren

// Dein Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyB2jh425QNeoXsoPJ7b9jxho_7NQSpzoxg",
  authDomain: "air-german-app.firebaseapp.com",
  projectId: "air-german-app",
  storageBucket: "air-german-app.firebasestorage.app",
  messagingSenderId: "552328985317",
  appId: "1:552328985317:web:d413fc80c31a147e2cb20c",
  measurementId: "G-GTJYSJ32J5"
};

// Initialisieren
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app); // Firestore-Instanz exportieren

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQY_YbAFo1OR__HWUrR8zowgXKQypBgu8",
  authDomain: "rahulfm-2add1.firebaseapp.com",
  projectId: "rahulfm-2add1",
  storageBucket: "rahulfm-2add1.firebasestorage.app",
  messagingSenderId: "509346433078",
  appId: "1:509346433078:web:ed0cdc2a9173af34ceb097",
  measurementId: "G-XGM84ZH4QN",
  databaseURL: "https://rahulfm-2add1-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Only initialize analytics in production
let analytics = null;
if (import.meta.env.PROD) {
  analytics = getAnalytics(app);
}

export { app, analytics, database };

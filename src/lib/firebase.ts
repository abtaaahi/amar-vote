// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyChyotJMBc_6u5qSZ_GO4YkAO0zGSGbpb4",
  authDomain: "amar-vote-nsu.firebaseapp.com",
  projectId: "amar-vote-nsu",
  storageBucket: "amar-vote-nsu.appspot.com",
  messagingSenderId: "399036319352",
  appId: "1:399036319352:web:9a1b240a76dbda49454f8d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

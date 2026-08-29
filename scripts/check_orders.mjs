import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  console.log('Checking project:', firebaseConfig.projectId);
  const snap = await getDocs(collection(db, 'orders'));
  console.log(`Total orders in Firestore: ${snap.docs.length}`);
  snap.docs.forEach(doc => {
    console.log(`- Order Doc ID: ${doc.id}`);
    console.log(JSON.stringify(doc.data(), null, 2));
  });

  const usersSnap = await getDocs(collection(db, 'users'));
  console.log(`Total users in Firestore: ${usersSnap.docs.length}`);
  usersSnap.docs.forEach(doc => {
    console.log(`- User: ${doc.id} ->`, doc.data());
  });
}

check().catch(console.error);

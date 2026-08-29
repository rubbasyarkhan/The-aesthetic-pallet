import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBSQsOhWoLAe0vrzOXABvU0IQ7D_Y5fn54",
  authDomain: "the-aesthetic-palette-ryk.firebaseapp.com",
  projectId: "the-aesthetic-palette-ryk",
  storageBucket: "the-aesthetic-palette-ryk.firebasestorage.app",
  messagingSenderId: "311232710879",
  appId: "1:311232710879:web:4a1ddcf9af20487786816a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log("Testing Firestore addDoc with undefined field...");
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      title: "Test Product With Undefined",
      price: 3500,
      originalPrice: undefined, // this might throw
      category: "crochet-bags",
      createdAt: serverTimestamp()
    });
    console.log("Success with undefined! docId:", docRef.id);
  } catch (err) {
    console.error("Caught expected error with undefined:", err.message);
  }

  console.log("\nTesting Firestore addDoc with clean object...");
  try {
    const cleanObj = {
      title: "Test Product Clean",
      price: 3500,
      category: "crochet-bags",
      createdAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, 'products'), cleanObj);
    console.log("Success with clean object! docId:", docRef.id);
  } catch (err) {
    console.error("Error with clean object:", err.message);
  }
}

run();

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyBSQsOhWoLAe0vrzOXABvU0IQ7D_Y5fn54',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'the-aesthetic-palette-ryk.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'the-aesthetic-palette-ryk',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'the-aesthetic-palette-ryk.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '311232710879',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:311232710879:web:4a1ddcf9af20487786816a'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const email = 'rykoffice008@gmail.com';
const password = 'Standard@1122';

async function createAdmin() {
  console.log(`Creating Firebase Auth user for ${email}...`);

  let userRecord;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    userRecord = cred.user;
    console.log(`✅ User created successfully in Firebase Auth! UID: ${userRecord.uid}`);
    
    await updateProfile(userRecord, {
      displayName: 'Studio Master Admin',
      photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
    });
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      console.log(`ℹ️ Email ${email} already exists in Firebase Auth. Attempting to sign in...`);
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        userRecord = cred.user;
        console.log(`✅ Successfully signed in to existing account! UID: ${userRecord.uid}`);
      } catch (signInErr) {
        console.error('Sign-in failed for existing account:', signInErr);
      }
    } else {
      console.error('Firebase user creation error:', err);
    }
  }

  // Also ensure the admin profile exists in Firestore `users` collection with role: 'admin'
  const uid = userRecord?.uid || 'admin_rykoffice008';
  console.log(`Syncing admin profile to Firestore users/${uid}...`);
  await setDoc(doc(db, 'users', uid), {
    id: uid,
    name: 'Studio Master Admin',
    email: email,
    role: 'admin',
    provider: 'email',
    createdAt: new Date().toISOString(),
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
  }, { merge: true });

  console.log(`✅ Admin profile saved to Firestore users/${uid} with role: 'admin'`);
}

createAdmin().catch(console.error);

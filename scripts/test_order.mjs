import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDocs, collection } from 'firebase/firestore';
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

async function testCreateOrder() {
  const orderId = 'TAP-COD-56495';
  const orderData = {
    orderId,
    userId: 'test_fashi_khan',
    userEmail: 'khanfashi32@gmail.com',
    createdAt: new Date().toISOString(),
    items: [
      {
        id: 'cart-1',
        productId: 'crochet-daisy-bucket-hat',
        product: {
          id: 'crochet-daisy-bucket-hat',
          title: 'Sunny Days Daisy Crochet Bucket Hat',
          price: 3800
        },
        quantity: 1,
        unitPrice: 3800,
        customization: { colorway: 'Linen Ecru' }
      }
    ],
    subtotal: 3800,
    shipping: 0,
    packagingCost: 0,
    total: 3800,
    customer: {
      fullName: 'Fashi Khan',
      email: 'khanfashi32@gmail.com',
      phoneNumber: '03112887743',
      streetAddress: 'r395 block 9 fb area karachi',
      city: 'karachi',
      postalCode: '75950',
      paymentMethod: 'COD'
    },
    estimatedDeliveryDate: 'In 2-4 Business Days',
    status: 'PENDING_CONFIRMATION'
  };

  console.log('Writing test order to Firestore...');
  await setDoc(doc(db, 'orders', orderId), orderData);
  console.log('✅ Order written successfully!');

  // Also sync user profile into 'users' collection so Customer Directory shows them!
  const userDoc = {
    id: 'user_khanfashi32',
    name: 'Fashi Khan',
    email: 'khanfashi32@gmail.com',
    phone: '03112887743',
    role: 'customer',
    provider: 'google',
    createdAt: new Date().toISOString(),
    savedAddress: {
      streetAddress: 'r395 block 9 fb area karachi',
      city: 'karachi',
      postalCode: '75950'
    }
  };
  await setDoc(doc(db, 'users', 'user_khanfashi32'), userDoc);
  console.log('✅ User written to users collection!');

  const snap = await getDocs(collection(db, 'orders'));
  console.log(`Orders in Firestore now: ${snap.docs.length}`);
}

testCreateOrder().catch(console.error);

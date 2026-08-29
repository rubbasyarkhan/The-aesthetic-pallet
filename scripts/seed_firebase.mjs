import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  collection,
  serverTimestamp 
} from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyCLbRxTEvYsey-KKa2W3lr3sGBSmHfLy3s',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'b2rykcrud.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'b2rykcrud',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'b2rykcrud.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '454734934318',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:454734934318:web:3c032bf9caa7f7607c4abf'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_EMAIL = 'rykoffice008@gmail.com';
const ADMIN_PASS = 'Standard@1122';

// 10 Handcrafted Products with Images
const PRODUCTS = [
  {
    id: 'crochet-forever-roses',
    title: 'Eternal Bloom Hand-Crocheted Rose Bouquet',
    slug: 'eternal-bloom-hand-crocheted-rose-bouquet',
    sku: 'TAP-ROSE-001',
    category: 'crochet-flowers',
    occasion: 'anniversary-love',
    price: 4800,
    originalPrice: 5800,
    costPrice: 1800,
    stockQuantity: 18,
    lowStockThreshold: 5,
    leadTimeDays: 2,
    leadTimeText: 'Ready to Ship / 2 Days',
    isMadeToOrder: false,
    isReadyToShip: true,
    isBestseller: true,
    isNew: true,
    rating: 5.0,
    reviewCount: 94,
    tagline: 'Flowers that never fade · Stitched with pure soft cotton',
    shortDescription: 'Everlasting hand-crocheted roses with bendable floral wire stems wrapped in artisanal brown kraft paper and satin ribbon.',
    description: 'The sweetest gift for someone you adore. 5 hand-crocheted rosebuds in warm blush and cream hues that stay soft and vibrant forever. Each petal is individually looped and shaped.',
    images: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['100% Soft Organic Combed Cotton', 'Flexible Velvet-wrapped Florist Wire', 'Satin Bow'],
    dimensions: 'Height: 11 inches (Set of 5 stems)',
    craftTimeHours: 5,
    colorways: [
      { name: 'Romantic Blush & Cream', hex: '#E8B4A2', stockQuantity: 10 },
      { name: 'Sunset Terracotta & Peach', hex: '#C06C4D', stockQuantity: 8 }
    ],
    careInstructions: ['Gently dust with dry cloth.'],
    includedInPackage: ['5x Handmade Crochet Roses', 'Bouquet Wrapping', 'Plantable Seed Card'],
    customOptions: { allowGiftNote: true, allowCustomColor: true }
  },
  {
    id: 'crochet-strawberry-keychain',
    title: 'Berry Sweet Handmade Crochet Keychain Charm',
    slug: 'berry-sweet-handmade-crochet-keychain-charm',
    sku: 'TAP-KEY-002',
    category: 'crochet-keychains',
    occasion: 'birthday',
    price: 1800,
    originalPrice: 2200,
    costPrice: 500,
    stockQuantity: 26,
    lowStockThreshold: 6,
    leadTimeDays: 1,
    leadTimeText: 'Ready to Ship (1-2 Days)',
    isMadeToOrder: false,
    isReadyToShip: true,
    isBestseller: true,
    rating: 4.9,
    reviewCount: 112,
    tagline: 'Tiny pocket joy for your bags & car keys',
    shortDescription: 'Plump 3D hand-crocheted strawberry with tiny white seed embroidery and a blooming daisy on antique gold hardware.',
    description: 'Add instant cottagecore charm to your everyday tote bag or car keys! Handcrafted from milk cotton yarn with a sturdy clasp.',
    images: [
      'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['Soft Milk Cotton Yarn', 'Polyester Cloud Fiberfill', 'Gold Swivel Clasp'],
    dimensions: '3.5 inches total length',
    craftTimeHours: 2,
    colorways: [
      { name: 'Ruby Strawberry', hex: '#D9534F', stockQuantity: 16 },
      { name: 'Blush Pink Berry', hex: '#F4D6CC', stockQuantity: 10 }
    ],
    careInstructions: ['Spot clean with damp cloth.'],
    includedInPackage: ['1x Crochet Charm with Gift Backing Card'],
    customOptions: { allowGiftNote: true }
  },
  {
    id: 'crochet-daisy-hair-clips',
    title: 'Sunny Daisy Crochet Hair Clip Duo',
    slug: 'sunny-daisy-crochet-hair-clip-duo',
    sku: 'TAP-CLIP-003',
    category: 'hair-accessories',
    occasion: 'birthday',
    price: 1600,
    originalPrice: 2000,
    costPrice: 400,
    stockQuantity: 14,
    lowStockThreshold: 4,
    leadTimeDays: 1,
    leadTimeText: 'Ready to Ship',
    isMadeToOrder: false,
    isReadyToShip: true,
    isBestseller: true,
    rating: 4.9,
    reviewCount: 78,
    tagline: 'Cute, gentle hold · No hair snagging',
    shortDescription: 'Pair of handcrafted 3D daisy flower snap clips wrapped in soft yarn to protect delicate hair.',
    description: 'The easiest way to style a soft aesthetic look. Hand-stitched with buttery yellow centers.',
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['100% Combed Cotton Yarn', 'Linen Wrapped Stainless Snap Clip'],
    dimensions: '2.5 inches length per clip',
    craftTimeHours: 1.5,
    colorways: [
      { name: 'Buttercup & Cream', hex: '#FAF7F2', stockQuantity: 8 },
      { name: 'Dusty Rose & Sage', hex: '#E8B4A2', stockQuantity: 6 }
    ],
    careInstructions: ['Keep dry.'],
    includedInPackage: ['Set of 2 Hair Clips on Kraft Display Card'],
    customOptions: { allowGiftNote: true }
  },
  {
    id: 'crochet-cloud-sweater',
    title: 'Marshmallow Cloud Hand-Crocheted Cardigan',
    slug: 'marshmallow-cloud-hand-crocheted-cardigan',
    sku: 'TAP-SWEATER-004',
    category: 'crochet-wear',
    occasion: 'self-care',
    price: 13500,
    originalPrice: 15500,
    costPrice: 4500,
    stockQuantity: 4,
    lowStockThreshold: 5,
    leadTimeDays: 7,
    leadTimeText: 'Hand-crocheting: 5-7 Days',
    isMadeToOrder: true,
    isReadyToShip: false,
    isBestseller: true,
    rating: 5.0,
    reviewCount: 62,
    tagline: 'Like wearing a warm, gentle hug',
    shortDescription: 'Chunky organic cotton oversized cardigan with floral granny squares and natural wood buttons.',
    description: 'Indulge in pure handmade warmth. Each cardigan is hand-stitched over 14 hours using OEKO-TEX certified combed cotton.',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['100% Certified Organic Cotton Yarn', 'Carved Olive Wood Buttons'],
    dimensions: 'Relaxed Oversized Fit',
    craftTimeHours: 14,
    colorways: [
      { name: 'Oatmeal & Cream', hex: '#F1EDE9', stockQuantity: 2 },
      { name: 'Soft Blush & Terracotta', hex: '#E8B4A2', stockQuantity: 2 }
    ],
    sizes: ['XS/S', 'M/L', 'XL/XXL', 'Custom Fit'],
    careInstructions: ['Gentle hand wash in cool water; dry flat.'],
    includedInPackage: ['Cardigan in Muslin Bag', 'Seed Paper Note', 'Spare Wooden Button'],
    customOptions: { allowCustomMeasurements: true, allowCustomColor: true, allowGiftNote: true }
  },
  {
    id: 'crochet-daisy-bucket-hat',
    title: 'Sunny Days Daisy Crochet Bucket Hat',
    slug: 'sunny-days-daisy-crochet-bucket-hat',
    sku: 'TAP-HAT-005',
    category: 'crochet-wear',
    occasion: 'birthday',
    price: 3800,
    originalPrice: 4500,
    costPrice: 1200,
    stockQuantity: 11,
    lowStockThreshold: 4,
    leadTimeDays: 2,
    leadTimeText: 'Ready to Ship / 2 Days',
    isMadeToOrder: false,
    isReadyToShip: true,
    isBestseller: true,
    rating: 4.8,
    reviewCount: 46,
    tagline: 'Your sunny day aesthetic essential',
    shortDescription: 'Breezy, lightweight cotton bucket hat with raised granny square flowers around the crown.',
    description: 'Perfect for picnics, beach trips, and weekend cafes.',
    images: [
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['100% Breathable Organic Cotton Yarn'],
    dimensions: 'One Size (Flexible 21-23")',
    craftTimeHours: 4,
    colorways: [
      { name: 'Linen Ecru', hex: '#FAF7F2', stockQuantity: 6 },
      { name: 'Sage Meadow', hex: '#8DA399', stockQuantity: 5 }
    ],
    careInstructions: ['Spot clean or cold hand wash.'],
    includedInPackage: ['1x Bucket Hat in Recycled Linen Pouch'],
    customOptions: { allowGiftNote: true }
  },
  {
    id: 'custom-loved-ones-portrait',
    title: 'Custom Oil Portrait of Your Loved Ones or Pet',
    slug: 'custom-oil-portrait-of-your-loved-ones-or-pet',
    sku: 'TAP-ART-006',
    category: 'custom-portraits',
    occasion: 'anniversary-love',
    price: 18500,
    originalPrice: 22000,
    costPrice: 5500,
    stockQuantity: 6,
    lowStockThreshold: 3,
    leadTimeDays: 8,
    leadTimeText: 'Hand-painted: 8-10 Days',
    isMadeToOrder: true,
    isReadyToShip: false,
    isBestseller: true,
    rating: 5.0,
    reviewCount: 88,
    tagline: 'Turn your favorite memories into forever art',
    shortDescription: 'Custom textured oil painting on Belgian linen canvas hand-painted from your photo with rich impasto depth.',
    description: 'A deeply emotional heirloom gift. Send us a picture and our artist captures their warmth in oil paint.',
    images: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['Master Grade French Oils', 'Stretched Belgian Linen Canvas', 'Solid Oak Float Frame'],
    dimensions: '10x10" or 12x16" Canvas',
    craftTimeHours: 12,
    colorways: [
      { name: 'Warm Cream Glow', hex: '#FAF7F2', stockQuantity: 3 },
      { name: 'Soft Earth Tones', hex: '#D4A373', stockQuantity: 3 }
    ],
    sizes: ['10x10" Canvas', '12x16" Framed', '16x20" Grand Canvas'],
    careInstructions: ['Display away from high humidity.'],
    includedInPackage: ['Framed Portrait', 'Artist Authenticity Card', 'Hanging Wire Kit'],
    customOptions: { allowPhotoUploadPrompt: true, allowGiftNote: true }
  },
  {
    id: 'housewarming-wildflower-painting',
    title: 'Golden Hour Wildflowers Textured Oil Canvas',
    slug: 'golden-hour-wildflowers-textured-oil-canvas',
    sku: 'TAP-ART-007',
    category: 'paintings',
    occasion: 'housewarming',
    price: 16500,
    originalPrice: 19500,
    costPrice: 5000,
    stockQuantity: 3,
    lowStockThreshold: 4,
    leadTimeDays: 4,
    leadTimeText: 'Ships in 4-5 Days',
    isMadeToOrder: true,
    isReadyToShip: false,
    isBestseller: true,
    rating: 4.9,
    reviewCount: 37,
    tagline: 'Warmth and calm for new home walls',
    shortDescription: 'Rich 3D palette knife floral painting on natural linen canvas in a floating natural oak frame.',
    description: 'The ultimate housewarming centerpiece. Thick sculpted petals catch natural light.',
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['Artist Heavy Oils', 'Raw Belgian Linen Canvas', 'Solid Oak Frame'],
    dimensions: '12" x 16" Framed',
    craftTimeHours: 8,
    colorways: [
      { name: 'Golden Sunset Tones', hex: '#C06C4D', stockQuantity: 2 },
      { name: 'Calm Sage & White', hex: '#8DA399', stockQuantity: 1 }
    ],
    careInstructions: ['Dust with soft cloth.'],
    includedInPackage: ['Original Framed Art', 'Hanging Hardware Installed'],
    customOptions: { allowGiftNote: true }
  },
  {
    id: 'welcome-cozy-gift-set',
    title: 'The "Soft Moments" Complete Handmade Gift Box',
    slug: 'the-soft-moments-complete-handmade-gift-box',
    sku: 'TAP-GIFT-008',
    category: 'gift-sets',
    occasion: 'welcome-gifts',
    price: 7400,
    originalPrice: 8800,
    costPrice: 2200,
    stockQuantity: 9,
    lowStockThreshold: 5,
    leadTimeDays: 2,
    leadTimeText: 'Ready to Ship (2 Days)',
    isMadeToOrder: false,
    isReadyToShip: true,
    isBestseller: true,
    rating: 5.0,
    reviewCount: 53,
    tagline: 'A curated parcel of pure comfort and love',
    shortDescription: 'Includes: 1x Crochet Rose stem, 1x Strawberry Keychain, 1x Daisy Hair Clip, Lavender Sachet & Wax-Sealed Seed Note in a keepsake box.',
    description: 'The most thoughtful care package for birthdays or new beginnings.',
    images: [
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1549465220-1a8b92387103?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['Organic Cotton Items', 'Kraft Gift Box with Botanical Twine'],
    dimensions: 'Gift Box 8x8x4 inches',
    craftTimeHours: 6,
    colorways: [
      { name: 'Warm Terracotta & Rose', hex: '#E8B4A2', stockQuantity: 5 },
      { name: 'Matcha & Vanilla', hex: '#8DA399', stockQuantity: 4 }
    ],
    careInstructions: ['Store in cool dry place.'],
    includedInPackage: ['Crochet Rose', 'Keychain', 'Hair Clip', 'Lavender Sachet', 'Custom Gift Note'],
    customOptions: { allowGiftNote: true }
  },
  {
    id: 'crochet-potted-tulip',
    title: 'Evergreen Pastel Crochet Tulip Potted Plant',
    slug: 'evergreen-pastel-crochet-tulip-potted-plant',
    sku: 'TAP-POT-009',
    category: 'crochet-flowers',
    occasion: 'housewarming',
    price: 3200,
    originalPrice: 3800,
    costPrice: 900,
    stockQuantity: 15,
    lowStockThreshold: 4,
    leadTimeDays: 2,
    leadTimeText: 'Ready to Ship (2 Days)',
    isMadeToOrder: false,
    isReadyToShip: true,
    isBestseller: true,
    isNew: true,
    rating: 4.9,
    reviewCount: 41,
    tagline: 'A cheerful blossom that never needs watering',
    shortDescription: 'Hand-crocheted three-stem pastel tulip arrangement in a miniature terracotta knit pot with soil texture.',
    description: 'Brighten any study desk or windowsill with everlasting bloom.',
    images: [
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['100% Cotton Yarn', 'Solid Clay Weighted Base', 'Velvet Wire'],
    dimensions: 'Height: 8 inches',
    craftTimeHours: 3.5,
    colorways: [
      { name: 'Sunset Peach & Cream', hex: '#E8B4A2', stockQuantity: 8 },
      { name: 'Lavender & Buttercup', hex: '#FAF7F2', stockQuantity: 7 }
    ],
    careInstructions: ['Dust lightly with a dry cloth.'],
    includedInPackage: ['1x Potted Crochet Tulip Arrangement', 'Kraft Gift Tag'],
    customOptions: { allowGiftNote: true }
  },
  {
    id: 'crochet-sunflower-tote',
    title: 'Vintage Botanical Sunflower Hand-Crocheted Tote',
    slug: 'vintage-botanical-sunflower-hand-crocheted-tote',
    sku: 'TAP-TOTE-010',
    category: 'crochet-wear',
    occasion: 'self-care',
    price: 4900,
    originalPrice: 5900,
    costPrice: 1400,
    stockQuantity: 12,
    lowStockThreshold: 4,
    leadTimeDays: 3,
    leadTimeText: 'Ready to Ship / 3 Days',
    isMadeToOrder: false,
    isReadyToShip: true,
    isBestseller: true,
    isNew: true,
    rating: 5.0,
    reviewCount: 38,
    tagline: 'Roomy, sturdy, and full of sunshine vibes',
    shortDescription: 'Artisan shoulder tote crafted with stitched floral sunflower tiles and double-reinforced linen shoulder straps.',
    description: 'Your new favorite farmers market and cafe companion. Stitched with double-ply organic combed cotton.',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['100% Double-ply Organic Combed Cotton', 'Natural Linen Lining'],
    dimensions: '14" width x 15" height',
    craftTimeHours: 8,
    colorways: [
      { name: 'Sunflower Gold & Linen', hex: '#F4D06F', stockQuantity: 6 },
      { name: 'Terracotta Earth', hex: '#C06C4D', stockQuantity: 6 }
    ],
    careInstructions: ['Hand wash gently in cool water, dry flat.'],
    includedInPackage: ['1x Crochet Tote Bag', 'Organic Cotton Dust Bag'],
    customOptions: { allowGiftNote: true }
  }
];

async function runSeed() {
  console.log('🚀 Starting Firebase Seeding...');
  console.log(`📌 Project: ${firebaseConfig.projectId}`);

  // 1. Provision Admin Account in Firebase Auth & Firestore
  let adminUid = 'admin_rykoffice008';
  try {
    console.log(`\n🔑 Provisioning Admin: ${ADMIN_EMAIL}...`);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASS);
      adminUid = userCred.user.uid;
      await updateProfile(userCred.user, { displayName: 'Studio Master Admin' });
      console.log(`✅ Created Admin user in Firebase Auth (UID: ${adminUid})`);
    } catch (authErr) {
      if (authErr.code === 'auth/email-already-in-use') {
        console.log(`ℹ️ Admin email already exists in Auth, signing in to verify...`);
        const userCred = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASS);
        adminUid = userCred.user.uid;
        console.log(`✅ Successfully verified existing Admin user (UID: ${adminUid})`);
      } else {
        console.warn(`⚠️ Auth creation note:`, authErr.message);
      }
    }

    // Save Admin profile to Firestore users collection
    await setDoc(doc(db, 'users', adminUid), {
      id: adminUid,
      name: 'Studio Master Admin',
      email: ADMIN_EMAIL,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      role: 'admin',
      provider: 'email',
      createdAt: new Date().toISOString()
    }, { merge: true });
    console.log(`✅ Synced Admin document in Firestore 'users/${adminUid}' with role: 'admin'`);

  } catch (err) {
    console.error('❌ Admin setup error:', err);
  }

  // 2. Seed 10 Products with Images to Firestore
  console.log(`\n📦 Seeding ${PRODUCTS.length} Handcrafted Products into Firestore 'products' collection...`);
  let seededCount = 0;
  for (const prod of PRODUCTS) {
    try {
      const prodRef = doc(db, 'products', prod.id);
      await setDoc(prodRef, {
        ...prod,
        createdAt: new Date().toISOString()
      }, { merge: true });
      seededCount++;
      console.log(`   [${seededCount}/10] ✅ Seeded: ${prod.title} (Rs. ${prod.price})`);
    } catch (prodErr) {
      console.error(`   ❌ Failed to seed product ${prod.id}:`, prodErr.message);
    }
  }

  console.log(`\n🎉 SEEDING COMPLETE!`);
  console.log(`✨ Total Products Seeded in Firestore: ${seededCount}/${PRODUCTS.length}`);
  console.log(`🔐 Admin Account: ${ADMIN_EMAIL} / ${ADMIN_PASS}`);
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('Fatal seeding error:', err);
  process.exit(1);
});

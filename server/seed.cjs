const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.3glqmhv.mongodb.net/astheticpallettest';

const Product = require('./models/Product.cjs');
const Order = require('./models/Order.cjs');
const User = require('./models/User.cjs');
const Review = require('./models/Review.cjs');

const SEED_PRODUCTS = [
  {
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
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['100% Soft Organic Combed Cotton', 'Flexible Velvet-wrapped Florist Wire', 'Satin Bow'],
    dimensions: 'Height: 11 inches (Set of 5 stems)',
    craftTimeHours: 5,
    colorways: [
      { name: 'Romantic Blush & Cream', hex: '#E8B4A2' },
      { name: 'Sunset Terracotta & Peach', hex: '#C06C4D' },
      { name: 'Pastel Lilac & Sage', hex: '#8DA399' }
    ],
    careInstructions: ['Gently dust with dry cloth or blow with cool air hairdryer.'],
    includedInPackage: ['5x Handmade Crochet Roses', 'Bouquet Wrapping', 'Plantable Seed Card']
  },
  {
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
    description: 'Add instant cottagecore charm to your everyday tote bag or car keys! Handcrafted from milk cotton yarn with a sturdy clasp and adorable flower accent.',
    images: [
      'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['Soft Milk Cotton Yarn', 'Polyester Cloud Fiberfill', 'Gold Swivel Clasp'],
    dimensions: '3.5 inches total length',
    craftTimeHours: 2,
    colorways: [
      { name: 'Ruby Strawberry', hex: '#D9534F' },
      { name: 'Blush Pink Berry', hex: '#F4D6CC' },
      { name: 'Matcha Green Bell', hex: '#8DA399' }
    ],
    careInstructions: ['Spot clean with damp cloth.'],
    includedInPackage: ['1x Crochet Charm with Gift Backing Card']
  },
  {
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
    description: 'The easiest way to style a soft aesthetic look. Hand-stitched with buttery yellow centers and crisp cream petals, mounted on non-slip covered metal clips.',
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['100% Combed Cotton Yarn', 'Linen Wrapped Stainless Snap Clip'],
    dimensions: '2.5 inches length per clip',
    craftTimeHours: 1.5,
    colorways: [
      { name: 'Buttercup & Cream', hex: '#FAF7F2' },
      { name: 'Dusty Rose & Sage', hex: '#E8B4A2' }
    ],
    careInstructions: ['Keep dry.'],
    includedInPackage: ['Set of 2 Hair Clips on Kraft Display Card']
  },
  {
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
    description: 'Indulge in pure handmade warmth. Each cardigan is hand-stitched over 14 hours using OEKO-TEX certified combed cotton. Loose, breathable, and flattering with jeans or cozy dresses.',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['100% Certified Organic Cotton Yarn', 'Carved Olive Wood Buttons'],
    dimensions: 'Relaxed Oversized Fit (XS to XXL Available)',
    craftTimeHours: 14,
    colorways: [
      { name: 'Oatmeal & Cream', hex: '#F1EDE9' },
      { name: 'Soft Blush & Terracotta', hex: '#E8B4A2' },
      { name: 'Sage Garden', hex: '#8DA399' }
    ],
    sizes: ['XS/S (Bust 38")', 'M/L (Bust 42")', 'XL/XXL (Bust 46")', 'Custom Fit'],
    careInstructions: ['Gentle hand wash in cool water; dry flat.'],
    includedInPackage: ['Cardigan in Muslin Bag', 'Seed Paper Note', 'Spare Wooden Button']
  },
  {
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
    description: 'Perfect for picnics, beach trips, and weekend cafes. Breathable natural cotton keeps you cool while making any casual outfit look thoughtfully curated.',
    images: [
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['100% Breathable Organic Cotton Yarn'],
    dimensions: 'One Size (Flexible 21-23" circumference)',
    craftTimeHours: 4,
    colorways: [
      { name: 'Linen Ecru', hex: '#FAF7F2' },
      { name: 'Sage Meadow', hex: '#8DA399' },
      { name: 'Terracotta Sun', hex: '#C06C4D' }
    ],
    sizes: ['One Size (Relaxed Fit)'],
    careInstructions: ['Spot clean or cold hand wash.'],
    includedInPackage: ['1x Bucket Hat in Recycled Linen Pouch']
  },
  {
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
    description: 'A deeply emotional heirloom gift. Send us a picture of your partner, children, pet, or grandparents, and our artist will capture their warmth in glowing oil paint. We share progress photos before final varnish and dispatch.',
    images: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['Master Grade French Oils', 'Stretched Belgian Linen Canvas', 'Solid Oak Float Frame'],
    dimensions: '10x10" or 12x16" Canvas',
    craftTimeHours: 12,
    colorways: [
      { name: 'Warm Cream Glow', hex: '#FAF7F2' },
      { name: 'Soft Earth Tones', hex: '#D4A373' },
      { name: 'Moody Sepia', hex: '#54433D' }
    ],
    sizes: ['10x10" Canvas (Rs. 18,500)', '12x16" Framed (Rs. 23,500)', '16x20" Grand Canvas (Rs. 29,000)'],
    careInstructions: ['Display away from high humidity.'],
    includedInPackage: ['Framed Portrait', 'Artist Authenticity Card', 'Hanging Wire Kit']
  },
  {
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
    description: 'The ultimate housewarming centerpiece. Thick sculpted petals in terracotta, ivory, and sage catch natural room light beautifully throughout the day.',
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['Artist Heavy Oils', 'Raw Belgian Linen Canvas', 'Solid Oak Frame'],
    dimensions: '12" x 16" Framed',
    craftTimeHours: 8,
    colorways: [
      { name: 'Golden Sunset Tones', hex: '#C06C4D' },
      { name: 'Calm Sage & White', hex: '#8DA399' }
    ],
    careInstructions: ['Dust with soft cloth.'],
    includedInPackage: ['Original Framed Art', 'Hanging Hardware Installed']
  },
  {
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
    description: 'The most thoughtful care package for birthdays, congratulations, new beginnings, or a warm hug across the miles. Every item inside is handmade and individually wrapped.',
    images: [
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1549465220-1a8b92387103?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['Organic Cotton Items', 'Kraft Gift Box with Botanical Twine & Wax Seal'],
    dimensions: 'Gift Box 8x8x4 inches',
    craftTimeHours: 6,
    colorways: [
      { name: 'Warm Terracotta & Rose', hex: '#E8B4A2' },
      { name: 'Matcha & Vanilla', hex: '#8DA399' }
    ],
    careInstructions: ['Store in cool dry place.'],
    includedInPackage: ['Crochet Rose', 'Keychain', 'Hair Clip', 'Lavender Sachet', 'Custom Gift Note']
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB Atlas at:', MONGODB_URI.replace(/:([^:@]+)@/, ':****@'));
    await mongoose.connect(MONGODB_URI);
    console.log('✨ Connected successfully to MongoDB Atlas!');

    console.log('Clearing old product catalog...');
    await Product.deleteMany({});

    console.log(`Inserting ${SEED_PRODUCTS.length} handcrafted products in Pakistani Rupees (Rs.)...`);
    await Product.insertMany(SEED_PRODUCTS);

    console.log('Inserting default admin user (rykoffice008@gmail.com)...');
    await User.deleteMany({ email: 'rykoffice008@gmail.com' });
    await User.create({
      name: 'Studio Master Admin',
      email: 'rykoffice008@gmail.com',
      password: 'Standard@1122',
      role: 'admin',
      provider: 'email',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
    });

    console.log('Inserting initial reviews with photo customer gallery...');
    await Review.deleteMany({});
    await Review.create([
      {
        productId: 'crochet-daisy-hair-clips',
        author: 'Aria Malik',
        rating: 5,
        location: 'Lahore, Pakistan',
        comment: 'These daisy hair clips are pure perfection! The cotton is so soft and holds my curls without any slipping. Shipped safely via Cash on Delivery.',
        images: [
          'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80'
        ],
        verifiedPurchase: true
      },
      {
        productId: 'crochet-forever-roses',
        author: 'Zainab Qureshi',
        rating: 5,
        location: 'Islamabad, Pakistan',
        comment: 'The forever roses bouquet arrived in a fragrant lavender box with a handwritten note. My sister was in tears of joy on her birthday!',
        images: [
          'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80'
        ],
        verifiedPurchase: true
      }
    ]);

    console.log('Inserting sample COD orders...');
    await Order.deleteMany({});
    await Order.create([
      {
        orderId: 'TAP-COD-98214',
        userEmail: 'sophia.reynolds@gmail.com',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        items: [
          {
            id: 'item-1',
            productId: 'crochet-forever-roses',
            product: SEED_PRODUCTS[0],
            quantity: 1,
            unitPrice: 4800,
            customization: { colorway: 'Romantic Blush & Cream' }
          }
        ],
        subtotal: 4800,
        shipping: 0,
        packagingCost: 0,
        total: 4800,
        customer: {
          fullName: 'Sophia Reynolds',
          phoneNumber: '+92 (300) 892-1244',
          streetAddress: 'House 42, Street 8, F-7/2',
          city: 'Islamabad',
          postalCode: '44000',
          paymentMethod: 'COD'
        },
        estimatedDeliveryDate: 'In 2 Days',
        status: 'CRAFTING'
      },
      {
        orderId: 'TAP-COD-97103',
        userEmail: 'olivia.h@outlook.com',
        createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
        items: [
          {
            id: 'item-2',
            productId: 'custom-loved-ones-portrait',
            product: SEED_PRODUCTS[5],
            quantity: 1,
            unitPrice: 18500,
            customization: { colorway: 'Warm Cream Glow', customMeasurements: 'Golden Retriever portrait' }
          }
        ],
        subtotal: 18500,
        shipping: 0,
        packagingCost: 0,
        total: 18500,
        customer: {
          fullName: 'Ayesha Khan',
          phoneNumber: '+92 (321) 431-7788',
          streetAddress: 'Plot 18-C, Phase 6, DHA',
          city: 'Lahore',
          postalCode: '54000',
          paymentMethod: 'COD'
        },
        estimatedDeliveryDate: 'In 5 Days',
        status: 'PENDING_CONFIRMATION'
      }
    ]);

    console.log('✅ Database seeded successfully with Pakistani Rupee (Rs.) data in MongoDB Atlas!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

import { Product, Review } from '../types';

export const OCCASIONS_LIST = [
  { id: 'all', label: 'All Treasures', iconName: 'Sparkles', subtitle: 'Browse everything' },
  { id: 'birthday', label: 'Birthday Specials', iconName: 'Gift', subtitle: 'Gifts that feel magical' },
  { id: 'housewarming', label: 'Housewarming', iconName: 'Home', subtitle: 'Warm art for cozy walls' },
  { id: 'welcome-gifts', label: 'Welcome Gifts', iconName: 'Package', subtitle: 'Little tokens of warmth' },
  { id: 'anniversary-love', label: 'Love & Keepsakes', iconName: 'Heart', subtitle: 'Forever roses & portraits' },
  { id: 'self-care', label: 'Soft Treats', iconName: 'Smile', subtitle: 'Cozy wear & cute charms' },
];

export const FEATURED_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Aria K.',
    rating: 5,
    date: 'Yesterday',
    location: 'Islamabad',
    verifiedPurchase: true,
    productTitle: 'Hand-Crocheted Forever Rose Bouquet',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    comment: 'The crochet roses will never wilt! It came in the prettiest wax-sealed box with lavender scent. Best birthday gift ever.'
  },
  {
    id: 'rev-2',
    author: 'Mia C.',
    rating: 5,
    date: '3 days ago',
    location: 'Lahore',
    verifiedPurchase: true,
    productTitle: 'Custom Portrait of Loved Ones in Oil',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    comment: 'Ordered this for my best friend’s housewarming. The brushstrokes are thick and stunning in real life. Everyone asked where I got it!'
  },
  {
    id: 'rev-3',
    author: 'Sophia R.',
    rating: 5,
    date: '1 week ago',
    location: 'Karachi',
    verifiedPurchase: true,
    productTitle: 'Sweet Strawberry Crochet Keychain Charm',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
    comment: 'The squishiest, cutest keychain on my tote! Soft cotton, flawless tiny stitches, and paid Cash on Delivery with no hassle.'
  }
];

export const PRODUCTS: Product[] = [
  // 1. CROCHET FLOWERS & ETERNAL ROSES
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
      'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=85'
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
    includedInPackage: ['5x Handmade Crochet Roses', 'Bouquet Wrapping', 'Plantable Seed Card'],
    customOptions: { allowGiftNote: true, allowCustomColor: true }
  },

  // 2. CROCHET KEYCHAINS & CHARMS
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
    description: 'Add instant cottagecore charm to your everyday tote bag or car keys! Handcrafted from milk cotton yarn with a sturdy clasp and adorable flower accent.',
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85'
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
    includedInPackage: ['1x Crochet Charm with Gift Backing Card'],
    customOptions: { allowGiftNote: true }
  },

  // 3. CROCHET HAIR CLIPS & BOWS
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
    description: 'The easiest way to style a soft aesthetic look. Hand-stitched with buttery yellow centers and crisp cream petals, mounted on non-slip covered metal clips.',
    images: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['100% Combed Cotton Yarn', 'Linen Wrapped Stainless Snap Clip'],
    dimensions: '2.5 inches length per clip',
    craftTimeHours: 1.5,
    colorways: [
      { name: 'Buttercup & Cream', hex: '#FAF7F2' },
      { name: 'Dusty Rose & Sage', hex: '#E8B4A2' }
    ],
    careInstructions: ['Keep dry.'],
    includedInPackage: ['Set of 2 Hair Clips on Kraft Display Card'],
    customOptions: { allowGiftNote: true }
  },

  // 4. CROCHET SWEATER / CARDIGAN
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
    description: 'Indulge in pure handmade warmth. Each cardigan is hand-stitched over 14 hours using OEKO-TEX certified combed cotton. Loose, breathable, and flattering with jeans or cozy dresses.',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=85'
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
    includedInPackage: ['Cardigan in Muslin Bag', 'Seed Paper Note', 'Spare Wooden Button'],
    customOptions: { allowCustomMeasurements: true, allowCustomColor: true, allowGiftNote: true }
  },

  // 5. CROCHET BUCKET HAT
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
    description: 'Perfect for picnics, beach trips, and weekend cafes. Breathable natural cotton keeps you cool while making any casual outfit look thoughtfully curated.',
    images: [
      'https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=800&q=85',
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
    includedInPackage: ['1x Bucket Hat in Recycled Linen Pouch'],
    customOptions: { allowGiftNote: true }
  },

  // 6. CUSTOM OIL PAINTING OF LOVED ONES & PETS
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
    includedInPackage: ['Framed Portrait', 'Artist Authenticity Card', 'Hanging Wire Kit'],
    customOptions: { allowPhotoUploadPrompt: true, allowGiftNote: true }
  },

  // 7. HOUSEWARMING SUNSET & BOTANICAL PAINTING
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
    includedInPackage: ['Original Framed Art', 'Hanging Hardware Installed'],
    customOptions: { allowGiftNote: true }
  },

  // 8. WELCOME GIFT / BESTIE GIFT BOX
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
    includedInPackage: ['Crochet Rose', 'Keychain', 'Hair Clip', 'Lavender Sachet', 'Custom Gift Note'],
    customOptions: { allowGiftNote: true }
  },

  // 9. CROCHET POTTED TULIP MEADOW
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
    description: 'Brighten any study desk, windowsill, or bookshelf with everlasting bloom. Features 3 vibrant tulips with wire stems you can gently shape.',
    images: [
      'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['100% Cotton Yarn', 'Solid Clay Weighted Base', 'Velvet Wire'],
    dimensions: 'Height: 8 inches',
    craftTimeHours: 3.5,
    colorways: [
      { name: 'Sunset Peach & Cream', hex: '#E8B4A2' },
      { name: 'Lavender & Buttercup', hex: '#FAF7F2' }
    ],
    careInstructions: ['Dust lightly with a dry cloth.'],
    includedInPackage: ['1x Potted Crochet Tulip Arrangement', 'Kraft Gift Tag'],
    customOptions: { allowGiftNote: true }
  },

  // 10. CROCHET SUNFLOWER TOTE BAG
  {
    id: 'crochet-sunflower-tote',
    title: 'Vintage Botanical Sunflower Hand-Crocheted Tote',
    slug: 'vintage-botanical-sunflower-hand-crocheted-tote',
    sku: 'TAP-BAG-010',
    category: 'crochet-bags',
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
    description: 'Your new favorite farmers market and cafe companion. Stitched with double-ply organic combed cotton for durable everyday carry that holds books, iPads, and daily treasures.',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['100% Double-ply Organic Combed Cotton', 'Natural Linen Lining'],
    dimensions: '14" width x 15" height (10" strap drop)',
    craftTimeHours: 8,
    colorways: [
      { name: 'Sunflower Gold & Linen', hex: '#F4D06F' },
      { name: 'Terracotta Earth', hex: '#C06C4D' }
    ],
    careInstructions: ['Hand wash gently in cool water, dry flat.'],
    includedInPackage: ['1x Crochet Tote Bag', 'Organic Cotton Dust Bag'],
    customOptions: { allowGiftNote: true }
  },

  // 11. CROCHET DAISY CROSSBODY PURSE
  {
    id: 'crochet-daisy-crossbody-bag',
    title: 'Pastel Daisy Checkerboard Crochet Shoulder Bag',
    slug: 'pastel-daisy-checkerboard-crochet-shoulder-bag',
    sku: 'TAP-BAG-011',
    category: 'crochet-bags',
    occasion: 'birthday',
    price: 4200,
    originalPrice: 4800,
    costPrice: 1100,
    stockQuantity: 10,
    lowStockThreshold: 3,
    leadTimeDays: 2,
    leadTimeText: 'Ready to Ship (2 Days)',
    isMadeToOrder: false,
    isReadyToShip: true,
    isBestseller: true,
    isNew: true,
    rating: 4.9,
    reviewCount: 29,
    tagline: 'Chic, compact & effortlessly aesthetic',
    shortDescription: 'Hand-crocheted mini shoulder bag with magnetic clasp and braided cotton strap.',
    description: 'The perfect weekend purse to hold your phone, lip balm, and cardholder. Hand-knitted with soft combed yarn in a dreamy vintage checkerboard floral pattern.',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['100% Combed Cotton Yarn', 'Magnetic Brass Snap', 'Linen Inner Pocket'],
    dimensions: '8" width x 7" height (20" strap drop)',
    craftTimeHours: 6,
    colorways: [
      { name: 'Sage & Cream Checker', hex: '#8DA399' },
      { name: 'Blush Pink & Terracotta', hex: '#E8B4A2' }
    ],
    careInstructions: ['Spot clean with mild soapy water.'],
    includedInPackage: ['1x Handcrafted Crossbody Bag', 'Botanical Gift Box'],
    customOptions: { allowGiftNote: true }
  },

  // 12. CROCHET LAVENDER & DAISY BOUQUET
  {
    id: 'crochet-lavender-meadow-bouquet',
    title: 'Lavender Meadow Hand-Crocheted Floral Bouquet',
    slug: 'lavender-meadow-hand-crocheted-floral-bouquet',
    sku: 'TAP-ROSE-012',
    category: 'crochet-flowers',
    occasion: 'birthday',
    price: 5200,
    originalPrice: 6200,
    costPrice: 1900,
    stockQuantity: 14,
    lowStockThreshold: 4,
    leadTimeDays: 2,
    leadTimeText: 'Ready to Ship / 2 Days',
    isMadeToOrder: false,
    isReadyToShip: true,
    isBestseller: true,
    isNew: true,
    rating: 5.0,
    reviewCount: 45,
    tagline: 'Hand-knitted wildflowers that bloom perpetually',
    shortDescription: 'Deluxe bouquet with 3 lavender stems, 2 daisies, and 2 forever roses wrapped in craft paper.',
    description: 'An enchanting bouquet crafted by hand to bring timeless nature into any room. Bendable stems allow you to display them in any vase of your choice.',
    images: [
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=85'
    ],
    materials: ['100% Soft Combed Cotton Yarn', 'Bendable Floral Wire Stems', 'Waxed Kraft Paper'],
    dimensions: 'Height: 12 inches (Set of 7 stems)',
    craftTimeHours: 7,
    colorways: [
      { name: 'Pastel Lilac & Buttercup', hex: '#CDB4DB' },
      { name: 'Sunset Peach & Cream', hex: '#E8B4A2' }
    ],
    careInstructions: ['Dust with soft dry cloth.'],
    includedInPackage: ['7x Handmade Crochet Floral Stems', 'Signature Gift Wrapping', 'Wax-Sealed Note Card'],
    customOptions: { allowGiftNote: true }
  }
];

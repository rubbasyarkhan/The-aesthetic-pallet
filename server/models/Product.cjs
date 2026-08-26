const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  sku: { type: String, default: '' },
  category: { type: String, required: true },
  occasion: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  costPrice: { type: Number, default: 0 },
  stockQuantity: { type: Number, default: 10 },
  lowStockThreshold: { type: Number, default: 5 },
  leadTimeDays: { type: Number, default: 2 },
  leadTimeText: { type: String, default: 'Ready to Ship' },
  isMadeToOrder: { type: Boolean, default: false },
  isReadyToShip: { type: Boolean, default: true },
  isBestseller: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 1 },
  shortDescription: { type: String, default: '' },
  tagline: { type: String, default: '' },
  description: { type: String, default: '' },
  images: [{ type: String }],
  materials: [{ type: String }],
  craftTimeHours: { type: Number, default: 3 },
  colorways: [
    {
      name: String,
      hex: String,
      image: String
    }
  ],
  sizes: [{ type: String }],
  careInstructions: [{ type: String }],
  includedInPackage: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);

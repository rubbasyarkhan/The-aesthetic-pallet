const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String },
  userEmail: { type: String },
  items: [
    {
      id: String,
      productId: String,
      product: Object,
      quantity: Number,
      unitPrice: Number,
      customization: Object
    }
  ],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  packagingCost: { type: Number, default: 0 },
  total: { type: Number, required: true },
  customer: {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    streetAddress: { type: String, required: true },
    apartmentSuite: String,
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    deliveryNotes: String,
    paymentMethod: { type: String, default: 'COD' }
  },
  estimatedDeliveryDate: String,
  status: {
    type: String,
    enum: ['PENDING_CONFIRMATION', 'CRAFTING', 'DISPATCHED', 'DELIVERED'],
    default: 'PENDING_CONFIRMATION'
  },
  artisanNotes: String
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);

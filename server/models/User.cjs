const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  avatar: { type: String },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  provider: { type: String, enum: ['google', 'email'], default: 'email' },
  phone: { type: String },
  savedAddress: {
    streetAddress: String,
    apartmentSuite: String,
    city: String,
    postalCode: String
  }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);

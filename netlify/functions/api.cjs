const serverless = require('serverless-http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.3glqmhv.mongodb.net/astheticpallettest';
const ADMIN_ALERT_EMAIL = process.env.ADMIN_ALERT_EMAIL || 'rubbasyarkhan007@gmail.com';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'wweasl6y',
  api_key: process.env.CLOUDINARY_API_KEY || '813639846375321',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'EveOb7ZzJrHA8CaMABSDZ9C2vXU'
});

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Import Models
const Product = require('../../server/models/Product.cjs');
const Order = require('../../server/models/Order.cjs');
const User = require('../../server/models/User.cjs');
const Review = require('../../server/models/Review.cjs');

// Database Connection helper with caching for Serverless Lambda
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  try {
    const db = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    cachedDb = db;
    return db;
  } catch (err) {
    console.warn('MongoDB connection error:', err.message);
    throw err;
  }
}

// Middleware to ensure DB connection on every request
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
  } catch (e) {
    console.error('Failed to connect to MongoDB in serverless function', e);
  }
  next();
});

// Router for API prefix handling (Netlify redirects /api/* or direct function calls)
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: 'netlify_serverless',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'connecting',
    cloudinary: 'configured',
    alertEmail: ADMIN_ALERT_EMAIL,
    timestamp: new Date().toISOString()
  });
});

// Cloudinary Upload
router.post('/upload', async (req, res) => {
  try {
    const { image, images } = req.body;
    if (Array.isArray(images) && images.length > 0) {
      const uploadPromises = images.map((img) =>
        cloudinary.uploader.upload(img, {
          folder: 'aesthetic_palette',
          resource_type: 'auto'
        })
      );
      const results = await Promise.all(uploadPromises);
      return res.json({ urls: results.map((r) => r.secure_url) });
    }
    if (image) {
      const result = await cloudinary.uploader.upload(image, {
        folder: 'aesthetic_palette',
        resource_type: 'auto'
      });
      return res.json({ url: result.secure_url });
    }
    res.status(400).json({ error: 'No image data provided' });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ error: 'Cloudinary upload failed', message: error.message });
  }
});

// Cloudinary Delete
router.post('/delete-image', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL required' });
    const matches = url.match(/\/aesthetic_palette\/([^./]+)/);
    if (matches && matches[1]) {
      const publicId = `aesthetic_palette/${matches[1]}`;
      await cloudinary.uploader.destroy(publicId);
    }
    res.json({ success: true, message: 'Image deleted from Cloudinary' });
  } catch (error) {
    res.json({ success: true, message: 'Completed' });
  }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const adminUser = await User.findOne({
      email: email.trim().toLowerCase(),
      role: 'admin'
    });
    if (!adminUser || adminUser.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }
    res.json({
      success: true,
      token: 'jwt_admin_session_' + Date.now(),
      admin: {
        id: adminUser._id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database login query failed', error: error.message });
  }
});

// Products CRUD
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

router.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
});

router.patch('/products/:id/stock', async (req, res) => {
  try {
    const { stockQuantity } = req.body;
    const updated = await Product.findByIdAndUpdate(req.params.id, { stockQuantity }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating stock', error: error.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting product', error: error.message });
  }
});

// Reviews
router.get('/products/:productId/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

router.post('/products/:productId/reviews', async (req, res) => {
  try {
    const { author, rating, comment, location, images, avatar } = req.body;
    const review = new Review({
      productId: req.params.productId,
      author,
      rating,
      comment,
      location: location || 'Pakistan',
      images: images || [],
      avatar: avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(author)}`
    });
    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: 'Error creating review', error: error.message });
  }
});

// Orders & Email Alerts
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

router.post('/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    const saved = await order.save();

    if (Array.isArray(req.body.items)) {
      for (const item of req.body.items) {
        if (item.productId) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stockQuantity: -(item.quantity || 1) }
          });
        }
      }
    }

    const itemsSummary = (req.body.items || [])
      .map((it) => `• ${it.quantity}x ${it.product?.title || 'Item'} (Rs. ${it.unitPrice * it.quantity})`)
      .join('\n');

    const emailContent = `
✨ NEW CASH ON DELIVERY ORDER RECEIVED!
======================================
Order Reference: ${saved.orderId}
Total: Rs. ${saved.total.toLocaleString()} (Cash on Delivery)
Date: ${new Date().toLocaleString()}

CUSTOMER DETAILS:
Name: ${saved.customer.fullName}
Phone: ${saved.customer.phoneNumber}
Address: ${saved.customer.streetAddress}, ${saved.customer.city} (${saved.customer.postalCode})

ITEMS ORDERED:
${itemsSummary}
`;
    console.log(`📧 [ORDER EMAIL TO: ${ADMIN_ALERT_EMAIL}]`, emailContent);

    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Error placing order', error: error.message });
  }
});

router.patch('/orders/:orderId/status', async (req, res) => {
  try {
    const { status, artisanNotes } = req.body;
    const updated = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status, artisanNotes },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating order status', error: error.message });
  }
});

// Mount router on both root and /api for direct Netlify function compatibility
app.use('/api', router);
app.use('/.netlify/functions/api', router);
app.use('/', router);

module.exports.handler = serverless(app);

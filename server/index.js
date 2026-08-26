const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.3glqmhv.mongodb.net/astheticpallettest';

app.use(cors());
app.use(express.json());

// Import Models
const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');

// Connect to MongoDB Atlas with graceful handling
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✨ Connected to MongoDB Atlas (astheticpallettest) database successfully!');
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB Atlas connection warning (will run in resilient fallback mode):', err.message);
  });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'connecting_or_fallback',
    uri: MONGODB_URI.replace(/:([^:@]+)@/, ':****@'),
    timestamp: new Date().toISOString()
  });
});

// ================= PRODUCT & INVENTORY CRUD =================
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
});

// Update stock inventory
app.patch('/api/products/:id/stock', async (req, res) => {
  try {
    const { stockQuantity } = req.body;
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { stockQuantity },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating stock', error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting product', error: error.message });
  }
});

// ================= ORDERS CRUD =================
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    const saved = await order.save();

    // Decrement stock for ordered items
    if (Array.isArray(req.body.items)) {
      for (const item of req.body.items) {
        if (item.productId) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stockQuantity: -(item.quantity || 1) }
          });
        }
      }
    }

    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Error placing order', error: error.message });
  }
});

app.patch('/api/orders/:orderId/status', async (req, res) => {
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

// ================= ADMIN AUTHENTICATION =================
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  const configuredEmail = process.env.ADMIN_EMAIL || 'rykoffice008@gmail.com';
  const configuredPassword = process.env.ADMIN_PASSWORD || 'Standard@1122';

  if (email === configuredEmail && password === configuredPassword) {
    res.json({
      success: true,
      token: 'jwt_admin_session_' + Date.now(),
      admin: {
        email: configuredEmail,
        name: 'Studio Master Admin',
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Aesthetic Palette API Server running on port ${PORT}`);
});

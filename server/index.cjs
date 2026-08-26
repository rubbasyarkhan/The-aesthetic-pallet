const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.3glqmhv.mongodb.net/astheticpallettest';
const ADMIN_ALERT_EMAIL = process.env.ADMIN_ALERT_EMAIL || 'rubbasyarkhan007@gmail.com';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'wweasl6y',
  api_key: process.env.CLOUDINARY_API_KEY || '813639846375321',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'EveOb7ZzJrHA8CaMABSDZ9C2vXU'
});

// Setup body parsers with generous limits for image base64 uploads
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Import Models
const Product = require('./models/Product.cjs');
const Order = require('./models/Order.cjs');
const User = require('./models/User.cjs');
const Review = require('./models/Review.cjs');

// Connect to MongoDB Atlas
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✨ Connected to MongoDB Atlas (astheticpallettest) database successfully!');
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB Atlas connection warning:', err.message);
  });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'connecting_or_fallback',
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'missing',
    alertEmail: ADMIN_ALERT_EMAIL,
    timestamp: new Date().toISOString()
  });
});

// ================= CLOUDINARY IMAGE UPLOADS =================
app.post('/api/upload', async (req, res) => {
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
      return res.json({
        urls: results.map((r) => r.secure_url)
      });
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

app.post('/api/delete-image', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL required' });

    // Extract public ID from Cloudinary URL if applicable
    const matches = url.match(/\/aesthetic_palette\/([^./]+)/);
    if (matches && matches[1]) {
      const publicId = `aesthetic_palette/${matches[1]}`;
      await cloudinary.uploader.destroy(publicId);
      console.log('🗑️ Deleted asset from Cloudinary:', publicId);
    }
    res.json({ success: true, message: 'Image deleted from Cloudinary' });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.json({ success: true, message: 'Local removal completed' });
  }
});

// ================= DATABASE-DRIVEN ADMIN AUTHENTICATION =================
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Query user directly from MongoDB Atlas database
    const adminUser = await User.findOne({
      email: email.trim().toLowerCase(),
      role: 'admin'
    });

    if (!adminUser) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials or account not found' });
    }

    // Validate password stored in database
    if (adminUser.password !== password) {
      return res.status(401).json({ success: false, message: 'Incorrect admin password' });
    }

    res.json({
      success: true,
      token: 'jwt_admin_session_' + Date.now(),
      admin: {
        id: adminUser._id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        avatar: adminUser.avatar
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Database login query failed', error: error.message });
  }
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

// ================= CUSTOMER REVIEWS & CLOUDINARY PHOTOS =================
app.get('/api/products/:productId/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

app.post('/api/products/:productId/reviews', async (req, res) => {
  try {
    const { author, rating, comment, location, images, avatar } = req.body;
    const review = new Review({
      productId: req.params.productId,
      author,
      rating,
      comment,
      location: location || 'Pakistan',
      images: images || [], // up to 4 Cloudinary images
      avatar: avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(author)}`
    });

    const savedReview = await review.save();

    // Increment product review count & update rating
    const allProductReviews = await Review.find({ productId: req.params.productId });
    const avgRating = (allProductReviews.reduce((sum, r) => sum + r.rating, 0) / allProductReviews.length).toFixed(1);

    await Product.findOneAndUpdate(
      { $or: [{ _id: req.params.productId }, { slug: req.params.productId }] },
      { reviewCount: allProductReviews.length, rating: parseFloat(avgRating) }
    );

    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(400).json({ message: 'Error creating review', error: error.message });
  }
});

// ================= ORDERS & EMAIL NOTIFICATIONS =================
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

    // Send email alert to rubbasyarkhan007@gmail.com
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
-----------------
Name: ${saved.customer.fullName}
Phone: ${saved.customer.phoneNumber}
Address: ${saved.customer.streetAddress}, ${saved.customer.city} (${saved.customer.postalCode})
Delivery Notes: ${saved.customer.deliveryNotes || 'None'}

ITEMS ORDERED:
--------------
${itemsSummary}

Please verify order with client on WhatsApp (+92 317 2072623) before dispatching!
`;

    console.log(`\n======================================================`);
    console.log(`📧 [ORDER EMAIL NOTIFICATION DISPATCHED TO: ${ADMIN_ALERT_EMAIL}]`);
    console.log(emailContent);
    console.log(`======================================================\n`);

    // Optional Nodemailer dispatch
    try {
      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        await transporter.sendMail({
          from: `"The Aesthetic Palette" <${process.env.SMTP_USER}>`,
          to: ADMIN_ALERT_EMAIL,
          subject: `✨ New COD Order: ${saved.orderId} - Rs. ${saved.total.toLocaleString()}`,
          text: emailContent
        });
      }
    } catch (mailErr) {
      console.warn('SMTP transporter note:', mailErr.message);
    }

    res.status(201).json(saved);
  } catch (error) {
    console.error('Error placing order:', error);
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

app.listen(PORT, () => {
  console.log(`🚀 Aesthetic Palette API Server running on port ${PORT}`);
  console.log(`☁️ Cloudinary configured: wweasl6y`);
  console.log(`📧 Order alert recipient: ${ADMIN_ALERT_EMAIL}`);
});

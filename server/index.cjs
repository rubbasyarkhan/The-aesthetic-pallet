const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_ALERT_EMAIL = process.env.ADMIN_ALERT_EMAIL || 'rubbasyarkhan007@gmail.com';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'wweasl6y',
  api_key: process.env.CLOUDINARY_API_KEY || '813639846375321',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'EveOb7ZzJrHA8CaMABSDZ9C2vXU'
});

// Setup body parsers
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'firebase_firestore',
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

app.listen(PORT, () => {
  console.log(`🚀 Aesthetic Palette API Server running on port ${PORT}`);
  console.log(`🔥 Powered by Firebase Firestore & Firebase Auth`);
  console.log(`☁️ Cloudinary configured: wweasl6y`);
  console.log(`📧 Order alert recipient: ${ADMIN_ALERT_EMAIL}`);
});

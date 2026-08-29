import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_ALERT_EMAIL = process.env.ADMIN_ALERT_EMAIL || 'rubbasyarkhan007@gmail.com';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'wweasl6y',
  api_key: process.env.CLOUDINARY_API_KEY || '813639846375321',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'EveOb7ZzJrHA8CaMABSDZ9C2vXU'
});

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'firebase_firestore',
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'missing',
    alertEmail: ADMIN_ALERT_EMAIL,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/upload', async (req, res) => {
  try {
    const { image, images } = req.body;
    if (Array.isArray(images) && images.length > 0) {
      const uploadPromises = images.map((img) =>
        cloudinary.uploader.upload(img, { folder: 'aesthetic_palette', resource_type: 'auto' })
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
    res.status(500).json({ error: 'Cloudinary upload failed', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Aesthetic Palette server on port ${PORT} (Firebase Powered)`);
});

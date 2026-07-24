const express = require('express');
const cors = require('cors');
const multer = require('multer');
const crypto = require('crypto');
const { uploadToDrive, requireDrive, extractDriveFileId } = require('./driveStorage');
const { readData, writeData } = require('./driveDataStore');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_PUBLIC_BASE_URL = process.env.PUBLIC_API_BASE_URL || `http://localhost:${PORT}`;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || `${ADMIN_PASSWORD}-local-secret`;
const ADMIN_SESSION_TTL_MS = 8 * 60 * 60 * 1000;

const loginAttempts = new Map();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 8;

const parseAllowedOrigins = () => {
  const configured = process.env.ALLOWED_ORIGINS || process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  return configured.split(',').map((item) => item.trim()).filter(Boolean);
};

const allowedOrigins = parseAllowedOrigins();

const signAdminToken = (payload) => {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', ADMIN_TOKEN_SECRET).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
};

const verifyAdminToken = (token) => {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, providedSignature] = parts;
  const expectedSignature = crypto.createHmac('sha256', ADMIN_TOKEN_SECRET).update(encodedPayload).digest('base64url');
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (providedBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(providedBuffer, expectedBuffer)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (!payload?.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
};

const getClientIp = (req) => req.ip || req.connection?.remoteAddress || 'unknown';

const checkRateLimit = (ip) => {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record || now > record.expiresAt) {
    loginAttempts.delete(ip);
    return false;
  }
  return record.count >= LOGIN_MAX_ATTEMPTS;
};

const incrementLoginFailure = (ip) => {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record || now > record.expiresAt) {
    loginAttempts.set(ip, { count: 1, expiresAt: now + LOGIN_WINDOW_MS });
    return;
  }
  loginAttempts.set(ip, { count: record.count + 1, expiresAt: record.expiresAt });
};

const clearLoginFailures = (ip) => {
  loginAttempts.delete(ip);
};

const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization token.' });
  }
  const token = authHeader.slice('Bearer '.length).trim();
  const payload = verifyAdminToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired session. Please login again.' });
  }
  req.adminSession = payload;
  next();
};

const hasPrefix = (buffer, values) => values.every((value, index) => buffer[index] === value);

const isValidImageBuffer = (buffer, mimeType) => {
  if (!buffer || buffer.length < 12) return false;
  if (mimeType === 'image/png') {
    return hasPrefix(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  }
  if (mimeType === 'image/jpeg') {
    return hasPrefix(buffer, [0xff, 0xd8, 0xff]);
  }
  if (mimeType === 'image/webp') {
    const riff = buffer.subarray(0, 4).toString('ascii') === 'RIFF';
    const webp = buffer.subarray(8, 12).toString('ascii') === 'WEBP';
    return riff && webp;
  }
  return false;
};

const buildImageUrl = (fileId) => `${API_PUBLIC_BASE_URL}/api/images/${fileId}`;

const normalizeGalleryImages = (data) => {
  if (!Array.isArray(data?.gallery)) return data;
  const gallery = data.gallery.map((item) => {
    const fileId = extractDriveFileId(item?.url);
    if (!fileId) return item;
    return { ...item, url: buildImageUrl(fileId) };
  });
  return { ...data, gallery };
};

const normalizeReviews = (data) => {
  if (!Array.isArray(data?.reviews)) return data;
  const reviews = data.reviews.map((item) => {
    const fileId = extractDriveFileId(item?.imageUrl);
    if (!fileId) return item;
    return { ...item, imageUrl: buildImageUrl(fileId) };
  });
  return { ...data, reviews };
};

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json());
// Multer setup for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    cb(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype));
  }
});

const reviewUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    cb(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype));
  }
});

app.get('/', (req, res) => {
  res.json({
    service: 'Mouryan Tech Drive API',
    website: 'http://localhost:5173',
    contentEndpoint: '/api/content'
  });
});

// API: Get all content
app.get('/api/content', async (req, res) => {
  try {
    const data = await readData();
    const withGallery = normalizeGalleryImages(data);
    const withReviews = normalizeReviews(withGallery);
    res.json(withReviews);
  } catch (error) {
    res.status(503).json({ error: error.message || 'Failed to read content from Google Drive.' });
  }
});

// API: Update content (Protected by admin session token)
app.post('/api/content', requireAdminAuth, async (req, res) => {
  const { data } = req.body;

  try {
    const currentData = await readData();
    // Merge or completely replace based on structure
    const newData = { ...currentData, ...data };
    await writeData(newData);
    res.json({ success: true, message: 'Content updated successfully!' });
  } catch (error) {
    res.status(502).json({ error: error.message || 'Failed to save content to Google Drive.' });
  }
});

// API: Upload image
app.post('/api/upload', requireAdminAuth, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  if (!isValidImageBuffer(req.file.buffer, req.file.mimetype)) {
    return res.status(400).json({ error: 'Uploaded file is not a valid image. Please upload a real PNG, JPG, or WebP file.' });
  }

  try {
    const fileId = await uploadToDrive(req.file);
    return res.json({ success: true, url: buildImageUrl(fileId), storage: 'google-drive' });
  } catch (error) {
    console.error('Drive upload failed:', error.message);
    return res.status(502).json({ error: 'Image could not be saved to Google Drive.' });
  }
});

// API: Proxy image bytes from Drive so frontend always gets renderable image URLs
app.get('/api/images/:fileId', async (req, res) => {
  const fileId = extractDriveFileId(req.params.fileId);
  if (!fileId) {
    return res.status(400).json({ error: 'Invalid image identifier.' });
  }

  try {
    const drive = requireDrive();
    const metadata = await drive.files.get({
      fileId,
      fields: 'mimeType,name,modifiedTime'
    });
    const media = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    const mimeType = metadata.data?.mimeType || 'application/octet-stream';
    const fileName = metadata.data?.name || `${fileId}.img`;
    const lastModified = metadata.data?.modifiedTime;

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    if (lastModified) res.setHeader('Last-Modified', new Date(lastModified).toUTCString());
    res.setHeader('Cache-Control', 'public, max-age=3600');

    media.data.on('error', () => {
      if (!res.headersSent) res.status(502).end('Image stream failed.');
      else res.end();
    });
    media.data.pipe(res);
  } catch (error) {
    res.status(404).json({ error: 'Image not found or not accessible.' });
  }
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) return res.status(400).json({ error: error.message });
  if (error?.message === 'Not allowed by CORS') return res.status(403).json({ error: 'Origin not allowed.' });
  if (error) return res.status(400).json({ error: error.message || 'Only JPG, PNG, and WebP images up to 5 MB are supported.' });
  next();
});

// API: Login verification
app.post('/api/login', (req, res) => {
  const ip = getClientIp(req);
  if (checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many login attempts. Try again later.' });
  }

  const password = String(req.body?.password || '');
  if (password !== ADMIN_PASSWORD) {
    incrementLoginFailure(ip);
    return res.status(401).json({ error: 'Invalid password' });
  }

  clearLoginFailures(ip);
  const token = signAdminToken({
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + ADMIN_SESSION_TTL_MS
  });
  res.json({ success: true, token });
});

// API: Validate admin session
app.get('/api/admin/session', requireAdminAuth, (req, res) => {
  res.json({
    success: true,
    authenticated: true,
    expiresAt: req.adminSession.exp
  });
});

// API: Submit a customer review (public — no password required)
app.post('/api/reviews', reviewUpload.single('image'), async (req, res) => {
  const { name, service, rating, comment } = req.body;
  const cleanName = String(name || '').trim();
  const cleanComment = String(comment || '').trim();
  const cleanService = String(service || '').trim();

  if (!cleanName || !cleanComment) {
    return res.status(400).json({ error: 'Name and comment are required.' });
  }

  const parsedRating = Math.min(5, Math.max(1, parseInt(rating) || 5));

  const newReview = {
    id: `review-${Date.now()}`,
    name:    cleanName.slice(0, 100),
    service: cleanService.slice(0, 100),
    rating:  parsedRating,
    comment: cleanComment.slice(0, 1000),
    date:    new Date().toISOString().split('T')[0]
  };

  try {
    if (req.file) {
      if (!isValidImageBuffer(req.file.buffer, req.file.mimetype)) {
        return res.status(400).json({ error: 'Uploaded review image is invalid. Use a real PNG, JPG, or WebP file.' });
      }
      const imageFileId = await uploadToDrive(req.file);
      newReview.imageUrl = buildImageUrl(imageFileId);
    }

    const currentData = await readData();
    const reviews = Array.isArray(currentData.reviews) ? currentData.reviews : [];
    await writeData({ ...currentData, reviews: [...reviews, newReview] });
    res.json({ success: true, review: newReview });
  } catch (error) {
    console.error('Review save failed:', error.message);
    res.status(502).json({ error: 'Could not save review to Google Drive.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

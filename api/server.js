const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// File paths for persistence
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const WISHES_FILE = path.join(__dirname, 'data', 'wishes.json');
const CONTENT_FILE = path.join(__dirname, 'data', 'content.json'); // for photos/text sections

// Helpers to read/write JSON files
function readJson(filePath, defaultValue) {
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}
function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Ensure data folder and files exist
if (!fs.existsSync('data')) fs.mkdirSync('data');
if (!fs.existsSync(USERS_FILE)) writeJson(USERS_FILE, []);
if (!fs.existsSync(WISHES_FILE)) writeJson(WISHES_FILE, []);
if (!fs.existsSync(CONTENT_FILE)) writeJson(CONTENT_FILE, {
  hero: { photo: '', text: '' },
  story: { photo: '', text: '' },
  gallery: []
});

// Middleware to check logged in user
function userAuth(req, res, next) {
  if (req.session && req.session.userId) next();
  else res.status(401).json({ message: 'Unauthorized' });
}
// Middleware to check admin
function adminAuth(req, res, next) {
  if (req.session && req.session.isAdmin) next();
  else res.status(401).json({ message: 'Unauthorized' });
}

// ---- AUTH ROUTES ----

// User register
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

  const users = readJson(USERS_FILE, []);
  if (users.find(u => u.username === username)) return res.status(400).json({ message: 'Username already exists' });

  const newUser = {
    id: uuidv4(),
    username,
    password,
    approved: false, // Admin must approve
    photos: [],
  };
  users.push(newUser);
  writeJson(USERS_FILE, users);

  res.json({ message: 'Registered successfully, wait for admin approval' });
});

// User login
app.post('/api/user-login', (req, res) => {
  const { username, password } = req.body;
  const users = readJson(USERS_FILE, []);
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  if (!user.approved) return res.status(403).json({ message: 'Account not approved yet' });

  req.session.userId = user.id;
  req.session.username = user.username;
  req.session.isAdmin = false;
  res.json({ message: 'User logged in' });
});

// Admin login
app.post('/api/admin-login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    req.session.isAdmin = true;
    res.json({ message: 'Admin logged in' });
  } else {
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
});

// Logout (user or admin)
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
});

// ---- USER DASHBOARD ----

// Send a wish (user)
app.post('/api/wishes', userAuth, (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'Message required' });

  const wishes = readJson(WISHES_FILE, []);
  wishes.push({
    id: uuidv4(),
    userId: req.session.userId,
    username: req.session.username,
    message,
    createdAt: new Date().toISOString(),
  });
  writeJson(WISHES_FILE, wishes);
  res.json({ message: 'Wish sent' });
});

// Upload photo (user)
app.post('/api/user-upload-photo', userAuth, upload.single('photo'), (req, res) => {
  const users = readJson(USERS_FILE, []);
  const user = users.find(u => u.id === req.session.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const photoUrl = '/img/' + req.file.filename;
  user.photos.push(photoUrl);
  writeJson(USERS_FILE, users);
  res.json({ message: 'Photo uploaded', photoUrl });
});

// Get user data including photos (user)
app.get('/api/user-data', userAuth, (req, res) => {
  const users = readJson(USERS_FILE, []);
  const user = users.find(u => u.id === req.session.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ username: user.username, photos: user.photos });
});

// ---- ADMIN DASHBOARD ----

// Get all wishes (admin)
app.get('/api/admin/wishes', adminAuth, (req, res) => {
  const wishes = readJson(WISHES_FILE, []);
  res.json(wishes);
});

// Remove a wish (admin)
app.delete('/api/admin/wishes/:id', adminAuth, (req, res) => {
  let wishes = readJson(WISHES_FILE, []);
  wishes = wishes.filter(w => w.id !== req.params.id);
  writeJson(WISHES_FILE, wishes);
  res.json({ message: 'Wish removed' });
});

// Get all users (admin)
app.get('/api/admin/users', adminAuth, (req, res) => {
  const users = readJson(USERS_FILE, []);
  res.json(users);
});

// Approve user (admin)
app.post('/api/admin/users/approve/:id', adminAuth, (req, res) => {
  const users = readJson(USERS_FILE, []);
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.approved = true;
  writeJson(USERS_FILE, users);
  res.json({ message: 'User approved' });
});

// Get content (photos & texts for hero, story, gallery)
app.get('/api/admin/content', adminAuth, (req, res) => {
  const content = readJson(CONTENT_FILE, {});
  res.json(content);
});

// Update content sections
app.post('/api/admin/content', adminAuth, (req, res) => {
  // expects { section: 'hero'|'story'|'gallery', text: string, photo: string, gallery array for gallery section }
  const { section, text, photo, gallery } = req.body;
  const content = readJson(CONTENT_FILE, { hero: {}, story: {}, gallery: [] });

  if (section === 'gallery') {
    if (Array.isArray(gallery)) content.gallery = gallery;
  } else {
    if (text !== undefined) content[section].text = text;
    if (photo !== undefined) content[section].photo = photo;
  }

  writeJson(CONTENT_FILE, content);
  res.json({ message: 'Content updated' });
});

// Upload photo (admin)
app.post('/api/admin-upload-photo', adminAuth, upload.single('photo'), (req, res) => {
  const photoUrl = '/img/' + req.file.filename;
  res.json({ photoUrl });
});

// ---- Start server ----
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

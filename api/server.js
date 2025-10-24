// api/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;

// ===== Initialize Express app =====
const app = express();

// ===== Middleware =====
app.use(cors());
app.use(bodyParser.json());

// ===== JSON File Persistence =====
const WISHES_FILE = path.join(__dirname, 'wishes.json');

// Load wishes from file if it exists
let wishes = [];
(async () => {
  try {
    const data = await fs.readFile(WISHES_FILE, 'utf-8');
    wishes = JSON.parse(data);
  } catch (err) {
    if (err.code !== 'ENOENT') console.error('Error reading wishes.json:', err);
  }
})();

// Save wishes to file safely
let saving = false;
async function saveWishes() {
  if (saving) return; // skip if already saving
  saving = true;
  try {
    await fs.writeFile(WISHES_FILE, JSON.stringify(wishes, null, 2));
  } catch (err) {
    console.error('Error writing wishes.json:', err);
  }
  saving = false;
}

// ===== Periodic save every 5 seconds =====
setInterval(saveWishes, 5000);

// Save on server shutdown
process.on('exit', saveWishes);
process.on('SIGINT', () => {
  saveWishes().then(() => process.exit());
});
process.on('SIGTERM', () => {
  saveWishes().then(() => process.exit());
});

// ===== API ROUTES =====

// 🟢 Get all wishes
app.get('/api/wishes', (req, res) => {
  res.json(wishes);
});

// 🟢 Create a new wish
app.post('/api/wishes', (req, res) => {
  const { fullName, email, message, photo } = req.body;

  if (!fullName || !message) {
    return res.status(400).json({ error: 'Full name and message are required.' });
  }

  const id = Date.now();
  const newWish = { id, fullName, email, message, photo, likes: 0 };
  wishes.push(newWish);
  res.json(newWish);
});

// 🟢 Like a wish
app.post('/api/wishes/:id/like', (req, res) => {
  const wish = wishes.find(w => w.id == req.params.id);
  if (!wish) {
    return res.status(404).json({ error: 'Wish not found.' });
  }

  wish.likes += 1;
  res.json({ likes: wish.likes });
});

// ===== Root route for testing =====
app.get('/', (req, res) => {
  res.json({ message: '🎉 Wedding Wishes API is live!' });
});

// ===== Export Express app for Vercel =====
module.exports = app;

// ===== Local development (optional) =====
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`✅ Server running locally at http://localhost:${PORT}`));
}

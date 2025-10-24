// api/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express app
const app = express();

// ===== Middleware =====
app.use(cors());
app.use(bodyParser.json());

// ===== In-memory data store =====
// ⚠️ This resets every time the server restarts (not persistent)
let wishes = [];

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

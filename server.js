const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve static files from your main folder (WEDDING)
app.use(express.static(__dirname));

// In-memory storage for wishes
let wishes = [];

// ===== API ROUTES =====

// Get all wishes
app.get('/api/wishes', (req, res) => {
  res.json(wishes);
});

// Create a new wish
app.post('/api/wishes', (req, res) => {
  const { fullName, email, message, photo } = req.body;
  const id = Date.now();
  const newWish = { id, fullName, email, message, photo, likes: 0 };
  wishes.push(newWish);
  res.json(newWish);
});

// Like a wish
app.post('/api/wishes/:id/like', (req, res) => {
  const wish = wishes.find(w => w.id == req.params.id);
  if (wish) {
    wish.likes += 1;
    res.json({ likes: wish.likes });
  } else {
    res.status(404).json({ error: 'Wish not found' });
  }
});

// ✅ Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));

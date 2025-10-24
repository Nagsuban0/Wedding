const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" })); // support Base64 photos

const PORT = process.env.PORT || 3000;

// In-memory storage for demo (replace with DB in production)
let wishes = [];

// Utility: filter wishes by expiry date (durationDays)
function filterValidWishes() {
  const now = Date.now();
  return wishes.filter((wish) => {
    const created = new Date(wish.date).getTime();
    const duration = wish.durationDays || 30;
    return now - created <= duration * 24 * 60 * 60 * 1000;
  });
}

// GET all wishes (optional ?days param overrides duration filter)
app.get("/api/wishes", (req, res) => {
  const validWishes = filterValidWishes();
  res.json(validWishes);
});

// POST new wish
app.post("/api/wishes", (req, res) => {
  const { fullName, email, message, photo, date, durationDays } = req.body;

  if (!fullName || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const wish = {
    id: uuidv4(),
    fullName,
    email,
    message,
    photo: photo || null,
    date: date ? new Date(date).toISOString() : new Date().toISOString(),
    durationDays: durationDays || 30,
    likes: 0,
  };

  wishes.push(wish);
  res.status(201).json({ message: "Wish added", wish });
});

// PATCH to update a wish (likes, durationDays, etc.)
app.patch("/api/wishes/:id", (req, res) => {
  const { id } = req.params;
  const wish = wishes.find((w) => w.id === id);
  if (!wish) return res.status(404).json({ error: "Wish not found" });

  if (req.body.likes !== undefined) wish.likes = req.body.likes;
  if (req.body.durationDays !== undefined) wish.durationDays = req.body.durationDays;
  // Add other fields as needed

  res.json({ message: "Wish updated", wish });
});

// Endpoint specifically to "like" a wish
app.post("/api/wishes/:id/like", (req, res) => {
  const { id } = req.params;
  const wish = wishes.find((w) => w.id === id);
  if (!wish) return res.status(404).json({ error: "Wish not found" });

  wish.likes += 1;
  res.json({ message: "Wish liked", likes: wish.likes });
});

// Start server
app.listen(PORT, () => {
  console.log(`Wish server running on http://localhost:${PORT}`);
});

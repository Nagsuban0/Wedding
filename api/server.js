// server.js
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // allow large image payloads

const PORT = process.env.PORT || 3000;

// ===== In-memory storage (replace with DB in production) =====
let wishes = [];

// ===== Utility: filter wishes by expiry date =====
function filterValidWishes(days = 30) {
  const now = Date.now();
  return wishes.filter(wish => {
    const created = wish.date ? new Date(wish.date).getTime() : now;
    return now - created <= days * 24 * 60 * 60 * 1000;
  });
}


// ===== GET all wishes =====
app.get("/api/wishes", (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const validWishes = filterValidWishes(days);
    res.json(validWishes);
  } catch (err) {
    console.error("Error in GET /api/wishes:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== POST new wish =====
app.post("/api/wishes", (req, res) => {
  try {
    const { fullName, email, message, photo, date, durationDays } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const wishDate = date ? new Date(date) : new Date();
    if (isNaN(wishDate.getTime())) {
      return res.status(400).json({ error: "Invalid date" });
    }

    const wish = {
      id: uuidv4(),
      fullName,
      email,
      message,
      photo: photo || null,
      date: wishDate.toISOString(),
      durationDays: durationDays || 30,
      likes: 0,
    };

    wishes.push(wish);
    res.status(201).json({ message: "Wish added", wish });
  } catch (err) {
    console.error("Error in POST /api/wishes:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== PATCH wish (update likes or duration) =====
app.patch("/api/wishes/:id", (req, res) => {
  try {
    const { id } = req.params;
    const wish = wishes.find(w => w.id === id);
    if (!wish) return res.status(404).json({ error: "Wish not found" });

    const { likes, durationDays, fullName, email, message, photo } = req.body;

    if (likes !== undefined) wish.likes = likes;
    if (durationDays !== undefined) wish.durationDays = durationDays;
    if (fullName) wish.fullName = fullName;
    if (email) wish.email = email;
    if (message) wish.message = message;
    if (photo) wish.photo = photo;

    res.json({ message: "Wish updated", wish });
  } catch (err) {
    console.error("Error in PATCH /api/wishes/:id:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== Like a wish (increment likes safely) =====
app.post("/api/wishes/:id/like", (req, res) => {
  try {
    const { id } = req.params;
    const wish = wishes.find(w => w.id === id);
    if (!wish) return res.status(404).json({ error: "Wish not found" });

    wish.likes += 1;
    res.json({ message: "Wish liked", likes: wish.likes });
  } catch (err) {
    console.error("Error in POST /api/wishes/:id/like:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`Wish server running on http://localhost:${PORT}`);
});

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// In-memory storage for demo (replace with DB in production)
let wishes = [];

// Utility: filter wishes by expiry date
function filterValidWishes(days = 30) {
  const now = Date.now();
  return wishes.filter(wish => {
    const created = new Date(wish.date).getTime();
    return now - created <= days * 24 * 60 * 60 * 1000;
  });
}

// GET all wishes (optionally with a duration query param)
app.get("/api/wishes", (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const validWishes = filterValidWishes(days);
  res.json(validWishes);
});

// POST new wish
app.post("/api/wishes", (req, res) => {
  const { fullName, email, message, photo, date, durationDays } = req.body;

  if (!fullName || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Use provided date or current date
  const wishDate = date ? new Date(date) : new Date();

  // Store wish with optional durationDays (defaults to 30)
  const wish = {
    id: wishes.length + 1,
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
});

// PATCH to update a wish (e.g., likes or duration)
app.patch("/api/wishes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const wish = wishes.find(w => w.id === id);
  if (!wish) return res.status(404).json({ error: "Wish not found" });

  // Update likes or durationDays or other fields
  if (req.body.likes !== undefined) wish.likes = req.body.likes;
  if (req.body.durationDays !== undefined) wish.durationDays = req.body.durationDays;
  // Add other updates as needed

  res.json({ message: "Wish updated", wish });
});

// Start server
app.listen(PORT, () => {
  console.log(`Wish server running on http://localhost:${PORT}`);
});

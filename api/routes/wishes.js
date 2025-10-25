const express = require("express");
const router = express.Router();
const db = require("../db");

// ===== Get all wishes =====
router.get("/", (req, res) => {
  try {
    const wishes = db.prepare("SELECT * FROM wishes ORDER BY id DESC").all();
    res.json(wishes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load wishes" });
  }
});

// ===== Create new wish =====
router.post("/", (req, res) => {
  try {
    const { fullName, email, message, photo } = req.body;
    if (!fullName || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const stmt = db.prepare(`
      INSERT INTO wishes (fullName, email, message, photo)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(fullName, email, message, photo || "");

    const newWish = db
      .prepare("SELECT * FROM wishes WHERE id = ?")
      .get(result.lastInsertRowid);

    res.json(newWish);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save wish" });
  }
});

// ===== Like a wish =====
router.post("/:id/like", (req, res) => {
  try {
    const wish = db.prepare("SELECT * FROM wishes WHERE id = ?").get(req.params.id);
    if (!wish) return res.status(404).json({ error: "Wish not found" });

    const newLikes = wish.likes + 1;
    db.prepare("UPDATE wishes SET likes = ? WHERE id = ?").run(newLikes, req.params.id);
    res.json({ likes: newLikes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to like wish" });
  }
});

module.exports = router;

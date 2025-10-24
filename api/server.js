// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors());
app.use(express.json({ limit: "10mb" })); // handle JSON and base64 photos
app.use(express.urlencoded({ extended: true }));

// ===== MongoDB Setup =====
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ===== Wish Schema =====
const wishSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  photo: { type: String, default: "" },
  likes: { type: Number, default: 0 },
}, { timestamps: true });

const Wish = mongoose.model("Wish", wishSchema);

// ===== Routes =====

// Get all wishes
app.get("/api/wishes", async (req, res) => {
  try {
    const wishes = await Wish.find().sort({ createdAt: -1 });
    res.json(wishes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch wishes" });
  }
});

// Submit a new wish
app.post("/api/wishes", async (req, res) => {
  const { fullName, email, message, photo } = req.body;
  if (!fullName || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newWish = new Wish({ fullName, email, message, photo });
    await newWish.save();
    res.status(201).json(newWish);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create wish" });
  }
});

// Like a wish
app.post("/api/wishes/:id/like", async (req, res) => {
  try {
    const wish = await Wish.findById(req.params.id);
    if (!wish) return res.status(404).json({ error: "Wish not found" });
    wish.likes += 1;
    await wish.save();
    res.json({ likes: wish.likes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to like wish" });
  }
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

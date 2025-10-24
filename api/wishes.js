import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Connect to Mongo only once
if (!global._mongoClientPromise) {
  global._mongoClientPromise = mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
await global._mongoClientPromise;

// Schema + model
const wishSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  message: String,
  photo: String,
  likes: { type: Number, default: 0 },
}, { timestamps: true });

const Wish = mongoose.models.Wish || mongoose.model("Wish", wishSchema);

// Vercel handler
export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const wishes = await Wish.find().sort({ createdAt: -1 });
      return res.status(200).json(wishes);
    }

    if (req.method === "POST") {
      const { fullName, email, message, photo } = req.body;
      if (!fullName || !email || !message)
        return res.status(400).json({ error: "Missing required fields" });

      const newWish = new Wish({ fullName, email, message, photo });
      await newWish.save();
      return res.status(201).json(newWish);
    }

    if (req.method === "PATCH") {
      const { id } = req.query;
      const wish = await Wish.findById(id);
      if (!wish) return res.status(404).json({ error: "Wish not found" });
      wish.likes++;
      await wish.save();
      return res.json({ likes: wish.likes });
    }

    res.setHeader("Allow", ["GET", "POST", "PATCH"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

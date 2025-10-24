import { db } from "../../lib/db";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const wishes = await db.getWishes(); // make sure this works
      res.status(200).json(wishes);
    } else if (req.method === "POST") {
      const { fullName, email, message, photo } = req.body;
      if (!fullName || !email || !message) {
        return res.status(400).json({ error: "Missing fields" });
      }
      const newWish = await db.createWish({ fullName, email, message, photo });
      res.status(201).json(newWish);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("A server error has occurred");
  }
}

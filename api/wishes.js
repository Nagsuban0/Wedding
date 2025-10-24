let wishes = []; // In-memory storage (resets on server restart)

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const days = parseInt(req.query.days) || 30;
      const now = Date.now();
      const validWishes = wishes.filter(wish => {
        const created = wish.date ? new Date(wish.date).getTime() : now;
        return now - created <= days * 24 * 60 * 60 * 1000;
      });
      return res.status(200).json(validWishes);
    }

    if (req.method === "POST") {
      const { fullName, email, message, photo, date, durationDays } = req.body;
      if (!fullName || !email || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const wishDate = date ? new Date(date) : new Date();
      if (isNaN(wishDate.getTime())) {
        return res.status(400).json({ error: "Invalid date" });
      }
      const wish = {
        id: crypto.randomUUID(),
        fullName,
        email,
        message,
        photo: photo || null,
        date: wishDate.toISOString(),
        durationDays: durationDays || 30,
        likes: 0
      };
      wishes.push(wish);
      return res.status(201).json({ message: "Wish added", wish });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("API /api/wishes error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

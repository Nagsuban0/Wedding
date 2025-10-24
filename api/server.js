// 🟢 Create a new wish
app.post('/api/wishes', async (req, res) => {
  const { fullName, email, message, photo } = req.body;

  if (!fullName || !message) {
    return res.status(400).json({ error: 'Full name and message are required.' });
  }

  const id = Date.now();
  const newWish = { id, fullName, email, message, photo, likes: 0 };
  wishes.push(newWish);

  try {
    await saveWishes(); // ✅ Persist immediately
    res.json(newWish);
  } catch (err) {
    console.error("Failed to save new wish:", err);
    res.status(500).json({ error: "Failed to save wish." });
  }
});

// 🟢 Like a wish
app.post('/api/wishes/:id/like', async (req, res) => {
  const wish = wishes.find(w => w.id == req.params.id);
  if (!wish) {
    return res.status(404).json({ error: 'Wish not found.' });
  }

  wish.likes += 1;

  try {
    await saveWishes(); // ✅ Persist likes immediately
    res.json({ likes: wish.likes });
  } catch (err) {
    console.error("Failed to save like:", err);
    res.status(500).json({ error: "Failed to save like." });
  }
});

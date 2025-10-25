const express = require("express");
const cors = require("cors");
const wishRoutes = require("./routes/wishes");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/wishes", wishRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ SQLite API running on port ${PORT}`));

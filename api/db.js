const { createClient } = require("@libsql/client");
require("dotenv").config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

(async () => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS wishes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      photo TEXT,
      likes INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("✅ Connected to Turso & ensured table exists");
})();

module.exports = db;

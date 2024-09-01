const sqlite3 = require('sqlite3');
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const fs = require("fs");

// Resolve the path to the database file
const dbPath = path.resolve(__dirname, process.env.DB_PATH);

// Open a connection to the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to database:", err);
  } else {
    console.log("Connected to SQLite database.");
    applySchema();
  }
});

function applySchema() {
  const schemaPath = path.resolve(__dirname, "schema.sql");
  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, "utf8");

    db.serialize(() => {
      db.exec(schema, (err) => {
        if (err) {
          console.error("Failed to apply schema:", err);
        } else {
          console.log("Database schema applied successfully.");
        }
      });
    });
  } else {
    console.warn("Schema file does not exist:", schemaPath);
  }
}

module.exports = db;

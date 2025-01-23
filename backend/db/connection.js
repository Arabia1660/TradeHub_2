// backend/db/connection.js
const mysql = require("mysql2");
const { promisify } = require("util");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "trading",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the MySQL database!");
  }
});

// Promisify the query method for async/await support
db.query = promisify(db.query);

module.exports = db;
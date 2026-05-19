const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");

console.log("Server file started");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= SERVE STATIC FILES =================
app.use(express.static(path.join(__dirname)));

// ================= MYSQL CONNECTION =================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",          // ← change if your MySQL root has a password
  database: "portfolio1_db"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    console.error("   Make sure MySQL is running and portfolio1_db exists.");
    console.error("   Run this in MySQL to create it:");
    console.error("     CREATE DATABASE portfolio1_db;");
    console.error("     USE portfolio1_db;");
    console.error("     CREATE TABLE users (");
    console.error("       id INT AUTO_INCREMENT PRIMARY KEY,");
    console.error("       name VARCHAR(100) NOT NULL,");
    console.error("       email VARCHAR(100) NOT NULL UNIQUE,");
    console.error("       password VARCHAR(255) NOT NULL,");
    console.error("       phone VARCHAR(20)");
    console.error("     );");
  } else {
    console.log("✅ Connected to portfolio1_db");
  }
});

// ================= LOGIN API =================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Email and password are required" });
  }

  const sql = "SELECT id, name, email FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error("Login DB error:", err);
      return res.json({ success: false, message: "Database error" });
    }

    if (result.length > 0) {
      res.json({
        success: true,
        name: result[0].name,
        email: result[0].email
      });
    } else {
      res.json({
        success: false,
        message: "Invalid email or password"
      });
    }
  });
});

// ================= REGISTER API =================
app.post("/register", (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    return res.json({ success: false, message: "All fields are required" });
  }

  const checkEmail = "SELECT id FROM users WHERE email = ?";

  db.query(checkEmail, [email], (err, result) => {
    if (err) {
      console.error("Register check error:", err);
      return res.json({ success: false, message: err.message });
    }

    if (result.length > 0) {
      return res.json({ success: false, message: "Email already exists" });
    }

    const insert = "INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)";

    db.query(insert, [name, email, password, phone], (err) => {
      if (err) {
        console.error("Register insert error:", err);
        return res.json({ success: false, message: err.message });
      }
      res.json({ success: true, message: "Account created successfully" });
    });
  });
});

// ================= CATCH-ALL (fixed for Express 5 / new path-to-regexp) =================
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`   Open http://localhost:${PORT}/login.html to start`);
});
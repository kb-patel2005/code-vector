const express = require("express");
const path = require("path");
const Product = require("./models/Product");
const cors = require("cors");
const { Op } = require("sequelize");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "frontend/dist")));

app.use(cors({
  origin: [
    "http://localhost:5173", // Vite dev server
    "https://code-vector-z6tm.onrender.com" // deployed frontend URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// --- API route ---
app.get("/products", async (req, res) => {
  const { limit = 20, cursor, category, direction = "next" } = req.query;

  const where = {};
  if (category) where.category = category;

  let order = [["created_at", "DESC"], ["id", "DESC"]];
  const options = { where, order, limit: parseInt(limit, 10) };

  if (cursor) {
    if (direction === "next") {
      options.where.created_at = { [Op.lt]: new Date(cursor) };
    } else {
      options.where.created_at = { [Op.gt]: new Date(cursor) };
      options.order = [["created_at", "ASC"], ["id", "ASC"]];
    }
  }

  let products = await Product.findAll(options);

  if (direction === "prev") {
    products = products.reverse();
  }

  let nextCursor = null;
  let prevCursor = null;
  if (products.length > 0) {
    nextCursor = products[products.length - 1].created_at.toISOString();
    prevCursor = products[0].created_at.toISOString();
  }

  res.json({ products, nextCursor, prevCursor });
});

// --- Serve frontend build ---
app.use(express.static(path.join(__dirname, "frontend/dist")));

// Catch‑all: send index.html for any non‑API route
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

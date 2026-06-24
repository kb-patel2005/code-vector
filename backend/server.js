const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const Product = require("./models/Product");
const cors = require("cors");
const { Op } = require("sequelize");
require("dotenv").config();
const { socket } = require("socket.io")

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "frontend/dist")));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://code-vector-z6tm.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("joinChannel", (channelName) => {
    socket.join(channelName);
    console.log(`Socket ${socket.id} joined ${channelName}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

function broadcastToKrish(event, payload) {
  io.to("krishchannel").emit(event, payload);
}

app.use(cors({
  origin: ["http://localhost:5173", "https://code-vector-z6tm.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Products list with cursor pagination
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
  if (direction === "prev") products = products.reverse();

  let nextCursor = null;
  let prevCursor = null;
  if (products.length > 0) {
    nextCursor = products[products.length - 1].created_at.toISOString();
    prevCursor = products[0].created_at.toISOString();
  }

  res.json({ products, nextCursor, prevCursor });
});

// Add product
app.post("/api/products", async (req, res) => {
  try {
    const { name, category, price } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const product = await Product.create({
      name,
      category,
      price,
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Update product
app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price } = req.body;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = price;

    product.updated_at = new Date();
    await product.save();

    broadcastToKrish("productUpdated", product);

    return res.json(product);
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete product
app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    await product.destroy();

    broadcastToKrish("productDeleted", { id });

    return res.json({ message: "Product deleted successfully", id });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ error: "Failed to delete product" });
  }
});

//  app.use(express.static(path.join(__dirname, "frontend/dist")));

//  app.get(/.*/, (req, res) => {
//    res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
//  });

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
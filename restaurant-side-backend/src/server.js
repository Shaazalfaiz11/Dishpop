// ======================
// SERVER ENTRY POINT
// ======================

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

// Middlewares
const { isAuthenticated } = require("./middlewares/isAuthenticated.js");

// Routes
const authRoutes = require("./routes/auth.Routes.js");
const menuRoutes = require("./routes/menuRoutes.js");
const dishRoutes = require("./routes/dishRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");

// Socket handler
const socketHandler = require("./config/socket.js");

dotenv.config();

const app = express();

// ======================
// CORS
// ======================
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// ======================
// Middlewares
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Debug Logger
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ======================
// MongoDB Connection
// ======================
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo Connection Error:", err));

// ======================
// SOCKET.IO
// ======================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  },
});

app.set("io", io);
socketHandler(io);

// ======================
// ROUTES
// ======================

// 🔓 Public Routes
app.use("/api/auth", authRoutes);

// 🔐 Protected Routes
app.use("/api/v1/menu", isAuthenticated, menuRoutes);
app.use("/api/v1/dish", isAuthenticated, dishRoutes);
app.use("/api/v1/order", isAuthenticated, orderRoutes);
app.use("/api/restaurant", require("./routes/restaurant.routes.js"));


// Healthcheck
app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend running" });
});

// ======================
// 404 Handler (Must be last route)
// ======================
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ======================
// GLOBAL ERROR HANDLER
// ======================
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

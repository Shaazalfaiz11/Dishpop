// ======================
// SERVER ENTRY POINT
// ======================

// LOAD ENV FIRST (IMPORTANT!)
require("dotenv").config();

// DEBUG ENVIRONMENT VARIABLES
console.log("=== ENV DEBUG START ===");
console.log("MONGO_URL:", process.env.MONGO_URL);
console.log("R2_ACCESS_KEY:", process.env.R2_ACCESS_KEY);
console.log("R2_SECRET_KEY:", process.env.R2_SECRET_KEY);
console.log("R2_BUCKET:", process.env.R2_BUCKET);
console.log("R2_ACCOUNT_ID:", process.env.R2_ACCOUNT_ID);
console.log("R2_PUBLIC_URL:", process.env.R2_PUBLIC_URL);
console.log("=== ENV DEBUG END ===");

const express = require("express");
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

const app = express();

// ======================
// CORS CONFIG
// ======================
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// ======================
// BODY PARSER
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
// MONGODB CONNECTION
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

// PUBLIC ROUTES
app.use("/api/auth", authRoutes);

// RESTAURANT AUTH REQUIRED ROUTES
app.use("/api/v1", isAuthenticated, menuRoutes);
app.use("/api/v1", isAuthenticated, dishRoutes);
app.use("/api/v1/order", isAuthenticated, orderRoutes);

// RESTAURANT MANAGEMENT ROUTES (ADMIN PANEL)
app.use("/api/restaurant", require("./routes/restaurant.routes.js"));

// ======================
// HEALTHCHECK
// ======================
app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend running" });
});

// ======================
// 404 HANDLER
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

// // ======================
// // SERVER ENTRY POINT
// // ======================

// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
// const http = require("http");
// const { Server } = require("socket.io");

// // ======================
// // ROUTES
// // ======================
// const authRoutes = require("./routes/auth.routes.js");
// const menuRoutes = require("./routes/menuRoutes.js");
// const dishRoutes = require("./routes/dishRoutes.js");
// const orderRoutes = require("./routes/orderRoutes.js");
// const restaurantRoutes = require("./routes/restaurant.routes.js");
// const userRoutes = require("./routes/user.routes.js");


// // ======================
// // MIDDLEWARES
// // ======================
// const isAuthenticated = require("./middlewares/isAuthenticated.js");
// const errorMiddleware = require("./middlewares/error.js");

// // ======================
// // SOCKET HANDLER
// // ======================
// const socketHandler = require("./config/socket.js");

// // ======================
// // ENV CONFIG
// // ======================
// dotenv.config();

// const app = express();

// // ======================
// // CORS
// // ======================
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "http://localhost:5174"],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   })
// );

// // ======================
// // GLOBAL MIDDLEWARES
// // ======================
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // Debug logger
// app.use((req, res, next) => {
//   console.log(`[${req.method}] ${req.url}`);
//   next();
// });

// // ======================
// // MONGODB CONNECTION
// // ======================
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.error("Mongo Connection Error:", err));

// // ======================
// // SOCKET.IO SETUP
// // ======================
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173", "http://localhost:5174"],
//     credentials: true,
//   },
// });

// app.set("io", io);
// socketHandler(io);

// // ======================
// // SAFE ROUTER WRAPPER
// // ======================
// // Allows app.use(path, isAuthenticated, router)
// // without changing structure
// const useProtected = (path, middleware, router) => {
//   app.use(path, middleware, (req, res, next) => router(req, res, next));
// };

// // ======================
// // ROUTES
// // ======================

// // Public routes (no auth required)
// app.use("/api/auth", authRoutes);

// // Protected routes (auth required)  -- keeping your structure
// useProtected("/api/v1/menu", isAuthenticated, menuRoutes);
// useProtected("/api/v1/dish", isAuthenticated, dishRoutes);
// useProtected("/api/v1/order", isAuthenticated, orderRoutes);

// // Restaurant routes (auth inside router)
// app.use("/api/v1/restaurant", restaurantRoutes);
// app.use("/api/users", userRoutes);


// // ======================
// // HEALTH CHECK
// // ======================
// app.get("/", (req, res) => {
//   res.json({ success: true, message: "Backend running successfully!" });
// });

// // ======================
// // 404 HANDLER
// // ======================
// app.use("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

// // ======================
// // GLOBAL ERROR HANDLER
// // ======================
 
// console.log("DEBUG >> errorMiddleware = ", errorMiddleware);
// app.use(errorMiddleware);


// // ======================
// // START SERVER
// // ======================
// const PORT = process.env.PORT || 5001;
// server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// ======================
// SERVER ENTRY POINT
// ======================

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

// ======================
// ROUTES
// ======================
const authRoutes = require("./routes/auth.routes.js");
const menuRoutes = require("./routes/menuRoutes.js");
const dishRoutes = require("./routes/dishRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const restaurantRoutes = require("./routes/restaurant.routes.js");
// const userRoutes = require("./routes/user.routes.js");

// ======================
// MIDDLEWARES
// ======================
const isAuthenticated = require("./middlewares/isAuthenticated.js");
const errorMiddleware = require("./middlewares/error.js");

// ======================
// SOCKET HANDLER
// ======================
const socketHandler = require("./config/socket.js");

// ======================
// ENV CONFIG
// ======================
dotenv.config();
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
// GLOBAL MIDDLEWARES
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Debug logger
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
// SOCKET.IO SETUP
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

// PROTECTED ROUTES (correct Express syntax)
app.use("/api/v1/menu", isAuthenticated, menuRoutes);
app.use("/api/v1/dish", isAuthenticated, dishRoutes);
app.use("/api/v1/order", isAuthenticated, orderRoutes);

// RESTAURANT ROUTES
app.use("/api/v1/restaurant", restaurantRoutes);

// USER ROUTES
// app.use("/api/users", userRoutes);

// ======================
// HEALTH CHECK
// ======================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend running successfully!",
  });
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
app.use(errorMiddleware);

// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

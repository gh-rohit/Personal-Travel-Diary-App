import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import travelStoryRoutes from "./routes/travelStory.route.js";
import { fileURLToPath } from "url";

dotenv.config();

console.log("MONGO_URI:", process.env.MONGO_URI);  // <-- Added to debug env variable

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for frontend (Replace with your frontend URL)
app.use(
  cors({
    origin: "https://personal-travel-diary-app-frontend.onrender.com", //frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow CRUD operations
    credentials: true, // Allow cookies & authorization headers
  })
);

app.use(cookieParser());

// for allowing json object in req body
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/travel-story", travelStoryRoutes);

// server static files from the uploads and assets directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
dotenv.config();
import authRoutes from "./routes/authRoutes.js";
import readingRoutes from "./routes/readingRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import profileRoutes  from "./routes/profileRoutes.js"

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Sweety API is running",
  });
});

app.get("/api/health", async (req, res) => {
  try {
    console.log("checking database connection...");
    const result = await pool.query("SELECT NOW()");

    res.status(200).json({
      success: true,
      message: "Database connected successfully",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/reading", readingRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/profile",profileRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

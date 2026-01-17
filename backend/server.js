import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import cors from "cors";
import todoRoutes from "./routes/todo.route.js";
import { connectDB } from "./config/db.js";
import path from "path";

const PORT = process.env.PORT || 5000;
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use("/api/todos", todoRoutes);

// Optional: Root API route for debugging
app.get("/", (req, res) => {
  res.send("API is running...");
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`server started at http://localhost:5000`);
  });
}

export default app;

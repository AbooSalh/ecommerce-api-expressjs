import express from "express";
import dotenv from "dotenv";
import dbConnection from "./core/config/database.config";
import categoryRouter from "./models/category/route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // ✅ Middleware for parsing JSON

dbConnection();

app.use("/api", [categoryRouter]); // ✅ Mount router with a prefix ("/api")

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

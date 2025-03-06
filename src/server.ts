import "tsconfig-paths/register";
import express from "express";
import dotenv from "dotenv";
import { helloRoutes } from "@/modules/hello/hello.module";
import dbConnection from "./core/config/database.config";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Register Hello Routes
app.use("/", helloRoutes);
dbConnection();
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

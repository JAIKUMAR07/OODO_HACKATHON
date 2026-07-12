import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

export default app;

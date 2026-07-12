import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";
import driverRoutes from "./src/routes/driver.routes.js";
import maintenanceRoutes from "./src/routes/maintenance.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/maintenance", maintenanceRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

export default app;

import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";
import vehicleRoutes from "./src/routes/vehicle.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";
import tripRoutes from "./src/routes/trip.routes.js";
import driverRoutes from "./src/routes/driver.routes.js";

import driverRoutes from "./src/routes/driver.routes.js";
import maintenanceRoutes from "./src/routes/maintenance.routes.js";
import expenseRoutes from "./src/routes/expense.routes.js";


const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal Server Error";
  
  if (!err.isOperational) {
    console.error(err);
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
});

export default app;

import { Router } from "express";
import {
  createFuelLog,
  getFuelLogs,
  createExpense,
  getExpenses,
  getVehicleOperationalCost,
} from "../controllers/expense.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// All expense routes require authentication
router.use(authenticate);

// Fuel Logs
router.post("/fuel", createFuelLog);
router.get("/fuel", getFuelLogs);

// General Expenses
router.post("/", createExpense);
router.get("/", getExpenses);

// Operational Cost
router.get("/vehicle/:vehicleId/operational-cost", getVehicleOperationalCost);

export default router;

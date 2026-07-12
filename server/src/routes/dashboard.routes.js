import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getKPIs,
  getVehicleStatus,
  getRecentVehicles,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

// All dashboard endpoints require authentication
router.use(authenticate);

router.get("/kpis", getKPIs);
router.get("/vehicle-status", getVehicleStatus);
router.get("/recent-vehicles", getRecentVehicles);

export default router;

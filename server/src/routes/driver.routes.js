import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getAvailableDrivers } from "../controllers/driver.controller.js";
import {  getDrivers,  getDriver,  createDriver,  updateDriverStatus,  updateSafetyScore,  deleteDriver,  getSafetyStats,} from "../controllers/driver.controller.js";


const router = express.Router();
// All driver routes require authentication
router.use(authenticate);
router.get("/available", getAvailableDrivers);
router.get("/", getDrivers);
router.get("/stats/safety", getSafetyStats);
router.get("/:id", getDriver);
router.post("/", createDriver);
router.patch("/:id/status", updateDriverStatus);
router.patch("/:id/safety-score", updateSafetyScore);
router.delete("/:id", deleteDriver);

export default router;


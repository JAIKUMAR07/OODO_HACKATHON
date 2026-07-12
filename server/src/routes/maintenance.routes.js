import { Router } from "express";
import {
  createMaintenanceLog,
  closeMaintenanceLog,
  getMaintenanceLogs,
  getMaintenanceLog,
  deleteMaintenanceLog,
} from "../controllers/maintenance.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// All maintenance routes require authentication
router.use(authenticate);

router.get("/", getMaintenanceLogs);
router.get("/:id", getMaintenanceLog);
router.post("/", createMaintenanceLog);
router.patch("/:id/close", closeMaintenanceLog);
router.delete("/:id", deleteMaintenanceLog);

export default router;

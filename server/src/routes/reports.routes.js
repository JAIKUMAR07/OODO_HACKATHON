import { Router } from "express";
import {
  getAnalyticsSummary,
  exportAnalyticsCSV,
} from "../controllers/reports.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// Require authentication for all reports and analytics routes
router.use(authenticate);

router.get("/summary", getAnalyticsSummary);
router.get("/export/csv", exportAnalyticsCSV);

export default router;

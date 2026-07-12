import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getAvailableDrivers } from "../controllers/driver.controller.js";

const router = express.Router();

router.use(authenticate);

router.get("/available", getAvailableDrivers);

export default router;

import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate, createVehicleSchema, updateVehicleSchema } from "../validators/vehicle.validator.js";
import {
  createVehicle,
  getVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle
} from "../controllers/vehicle.controller.js";

const router = express.Router();

// Require authentication for all vehicle routes
router.use(authenticate);

// GET routes (Accessible by all authenticated roles theoretically, or customize as needed)
router.get("/", getVehicles);
router.get("/:id", getSingleVehicle);

// POST, PUT, DELETE (Restricted to FLEET_MANAGER and DISPATCHER)
router.post(
  "/",
  authorizeRoles("FLEET_MANAGER", "DISPATCHER"),
  validate(createVehicleSchema),
  createVehicle
);

router.put(
  "/:id",
  authorizeRoles("FLEET_MANAGER", "DISPATCHER"),
  validate(updateVehicleSchema),
  updateVehicle
);

router.delete(
  "/:id",
  authorizeRoles("FLEET_MANAGER"), // Only fleet manager can retire vehicle?
  deleteVehicle
);

export default router;

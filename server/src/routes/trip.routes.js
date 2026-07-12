import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createTripSchema, assignTripSchema, completeTripSchema } from "../validators/trip.validator.js";
import {
  createDraftTrip,
  getTrips,
  getSingleTrip,
  assignTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip
} from "../controllers/trip.controller.js";

const router = express.Router();

router.use(authenticate);

// List and Detail
router.get("/", getTrips);
router.get("/:id", getSingleTrip);

// Actions (Only Dispatchers or Managers should orchestrate trips typically)
router.use(authorizeRoles("FLEET_MANAGER", "DISPATCHER"));

router.post("/", validate(createTripSchema), createDraftTrip);
router.post("/:id/assign", validate(assignTripSchema), assignTrip);
router.post("/:id/dispatch", dispatchTrip);
router.post("/:id/complete", validate(completeTripSchema), completeTrip);
router.post("/:id/cancel", cancelTrip);

export default router;

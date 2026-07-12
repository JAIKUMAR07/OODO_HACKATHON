import { Router } from "express";
import {
  getProfile,
  updateProfile,
  getUsers,
  updateUserRole,
} from "../controllers/settings.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// All settings and RBAC routes require authentication
router.use(authenticate);

// Personal Profile settings
router.get("/me", getProfile);
router.put("/profile", updateProfile);

// RBAC user management routes (restricted to Fleet Managers inside the controller)
router.get("/users", getUsers);
router.patch("/users/:id/role", updateUserRole);

export default router;

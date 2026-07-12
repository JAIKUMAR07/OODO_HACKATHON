import { prisma } from "../config/db.js";

// ─── GET CURRENT USER PROFILE ────────────────────────────────────────────────
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found." });
    return res.json({ user });
  } catch (error) {
    console.error("[GET PROFILE ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ─── UPDATE PROFILE DETAILS ──────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required." });
    }

    // Check if email is already in use by another user
    const existing = await prisma.user.findFirst({
      where: {
        email,
        id: { not: req.user.id },
      },
    });
    if (existing) {
      return res.status(400).json({ message: "Email is already in use." });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return res.json({ message: "Profile updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("[UPDATE PROFILE ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ─── GET ALL USERS FOR RBAC MANAGEMENT ───────────────────────────────────────
// Only FLEET_MANAGER role should access this (checked via middleware or inline)
export const getUsers = async (req, res) => {
  try {
    // Check if the current user is authorized
    if (req.user.role !== "FLEET_MANAGER") {
      return res.status(403).json({ message: "Access forbidden. Fleet Manager role required." });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ users });
  } catch (error) {
    console.error("[GET USERS ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ─── UPDATE USER ROLE (RBAC) ────────────────────────────────────────────────
// Only FLEET_MANAGER role should be able to update other roles
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (req.user.role !== "FLEET_MANAGER") {
      return res.status(403).json({ message: "Access forbidden. Fleet Manager role required." });
    }

    const validRoles = ["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    // Don't let users downgrade their own Fleet Manager role to prevent losing access
    if (id === req.user.id && role !== "FLEET_MANAGER") {
      return res.status(400).json({ message: "You cannot change or downgrade your own role." });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return res.json({ message: "User role updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("[UPDATE USER ROLE ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

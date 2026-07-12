import { prisma } from "../config/db.js";

// ─── CREATE MAINTENANCE LOG ──────────────────────────────────────────────────
// Automatically switches vehicle status to IN_SHOP
export const createMaintenanceLog = async (req, res) => {
  try {
    const { vehicleId, description, cost } = req.body;

    if (!vehicleId || !description) {
      return res.status(400).json({ message: "Vehicle ID and description are required." });
    }

    // Verify vehicle exists
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found." });
    }

    // Check if vehicle is already in maintenance
    const activeLog = await prisma.maintenanceLog.findFirst({
      where: { vehicleId, status: "ACTIVE" },
    });
    if (activeLog) {
      return res.status(400).json({ message: "Vehicle is already undergoing active maintenance." });
    }

    // Create log and update vehicle status to IN_SHOP in a transaction
    const [log] = await prisma.$transaction([
      prisma.maintenanceLog.create({
        data: {
          vehicleId,
          description,
          cost: cost ? parseFloat(cost) : 0,
          status: "ACTIVE",
        },
      }),
      prisma.vehicle.update({
        where: { id: vehicleId },
        data: { status: "IN_SHOP" },
      }),
    ]);

    return res.status(201).json({ message: "Maintenance log created and vehicle set to IN_SHOP.", log });
  } catch (error) {
    console.error("[CREATE MAINTENANCE ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ─── CLOSE MAINTENANCE LOG ───────────────────────────────────────────────────
// Switches vehicle status back to AVAILABLE and saves final cost
export const closeMaintenanceLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { cost } = req.body;

    const log = await prisma.maintenanceLog.findUnique({ where: { id } });
    if (!log) {
      return res.status(404).json({ message: "Maintenance log not found." });
    }

    if (log.status === "CLOSED") {
      return res.status(400).json({ message: "Maintenance log is already closed." });
    }

    // Update log and revert vehicle status to AVAILABLE
    const [updatedLog] = await prisma.$transaction([
      prisma.maintenanceLog.update({
        where: { id },
        data: {
          status: "CLOSED",
          closedAt: new Date(),
          cost: cost !== undefined ? parseFloat(cost) : log.cost,
        },
      }),
      prisma.vehicle.update({
        where: { id: log.vehicleId },
        data: { status: "AVAILABLE" },
      }),
    ]);

    return res.json({ message: "Maintenance log closed and vehicle status restored to AVAILABLE.", log: updatedLog });
  } catch (error) {
    console.error("[CLOSE MAINTENANCE ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ─── GET ALL MAINTENANCE LOGS ────────────────────────────────────────────────
export const getMaintenanceLogs = async (req, res) => {
  try {
    const { vehicleId, status } = req.query;

    const where = {};
    if (vehicleId) where.vehicleId = vehicleId;
    if (status) where.status = status;

    const logs = await prisma.maintenanceLog.findMany({
      where,
      include: {
        vehicle: {
          select: {
            registrationNumber: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ logs });
  } catch (error) {
    console.error("[GET MAINTENANCE ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ─── GET SINGLE MAINTENANCE LOG ──────────────────────────────────────────────
export const getMaintenanceLog = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await prisma.maintenanceLog.findUnique({
      where: { id },
      include: { vehicle: true },
    });

    if (!log) return res.status(404).json({ message: "Maintenance log not found." });
    return res.json({ log });
  } catch (error) {
    console.error("[GET SINGLE MAINTENANCE ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ─── DELETE MAINTENANCE LOG ──────────────────────────────────────────────────
export const deleteMaintenanceLog = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await prisma.maintenanceLog.findUnique({ where: { id } });
    if (!log) {
      return res.status(404).json({ message: "Maintenance log not found." });
    }

    // If deleting an active log, revert the vehicle back to AVAILABLE
    if (log.status === "ACTIVE") {
      await prisma.$transaction([
        prisma.maintenanceLog.delete({ where: { id } }),
        prisma.vehicle.update({
          where: { id: log.vehicleId },
          data: { status: "AVAILABLE" },
        }),
      ]);
    } else {
      await prisma.maintenanceLog.delete({ where: { id } });
    }

    return res.json({ message: "Maintenance log deleted." });
  } catch (error) {
    console.error("[DELETE MAINTENANCE ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

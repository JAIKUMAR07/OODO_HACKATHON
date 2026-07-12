import { prisma } from "../config/db.js";

// ─── GET ALL DRIVERS ─────────────────────────────────────────────────────────
export const getDrivers = async (req, res) => {
  try {
    const { status, search } = req.query;

    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { licenseNumber: { contains: search, mode: "insensitive" } },
        { contactNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    const drivers = await prisma.driver.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { email: true } } },
    });

    return res.json({ drivers });
  } catch (error) {
    console.error("[GET DRIVERS ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ─── GET SINGLE DRIVER ───────────────────────────────────────────────────────
export const getDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await prisma.driver.findUnique({
      where: { id },
      include: { user: { select: { email: true } }, trips: { orderBy: { createdAt: "desc" }, take: 5 } },
    });
    if (!driver) return res.status(404).json({ message: "Driver not found." });
    return res.json({ driver });
  } catch (error) {
    console.error("[GET DRIVER ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ─── CREATE DRIVER ───────────────────────────────────────────────────────────
export const createDriver = async (req, res) => {
  try {
    const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, userId } = req.body;

    if (!name || !licenseNumber || !licenseCategory || !licenseExpiryDate || !contactNumber) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existing = await prisma.driver.findUnique({ where: { licenseNumber } });
    if (existing) return res.status(409).json({ message: "License number already registered." });

    const driver = await prisma.driver.create({
      data: {
        name,
        licenseNumber,
        licenseCategory,
        licenseExpiryDate: new Date(licenseExpiryDate),
        contactNumber,
        userId: userId || null,
      },
    });

    return res.status(201).json({ message: "Driver created.", driver });
  } catch (error) {
    console.error("[CREATE DRIVER ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ─── UPDATE DRIVER STATUS ─────────────────────────────────────────────────────
export const updateDriverStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["AVAILABLE", "ON_TRIP", "OFF_DUTY", "SUSPENDED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const driver = await prisma.driver.update({
      where: { id },
      data: { status },
    });

    return res.json({ message: "Status updated.", driver });
  } catch (error) {
    console.error("[UPDATE DRIVER STATUS ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ─── UPDATE SAFETY SCORE ──────────────────────────────────────────────────────
export const updateSafetyScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { safetyScore } = req.body;

    if (safetyScore === undefined || safetyScore < 0 || safetyScore > 100) {
      return res.status(400).json({ message: "Safety score must be between 0 and 100." });
    }

    const driver = await prisma.driver.update({
      where: { id },
      data: { safetyScore: parseFloat(safetyScore) },
    });

    return res.json({ message: "Safety score updated.", driver });
  } catch (error) {
    console.error("[UPDATE SAFETY SCORE ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ─── DELETE DRIVER ────────────────────────────────────────────────────────────
export const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.driver.delete({ where: { id } });
    return res.json({ message: "Driver deleted." });
  } catch (error) {
    console.error("[DELETE DRIVER ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ─── SAFETY STATS ─────────────────────────────────────────────────────────────
export const getSafetyStats = async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({ select: { safetyScore: true, status: true } });

    const total = drivers.length;
    const avgScore = total ? drivers.reduce((s, d) => s + d.safetyScore, 0) / total : 0;
    const critical = drivers.filter((d) => d.safetyScore < 60).length;
    const suspended = drivers.filter((d) => d.status === "SUSPENDED").length;
    const available = drivers.filter((d) => d.status === "AVAILABLE").length;
    const onTrip = drivers.filter((d) => d.status === "ON_TRIP").length;

    return res.json({ total, avgScore: parseFloat(avgScore.toFixed(1)), critical, suspended, available, onTrip });
  } catch (error) {
    console.error("[SAFETY STATS ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

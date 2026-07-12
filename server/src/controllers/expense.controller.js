import { prisma } from "../config/db.js";

// ─── CREATE FUEL LOG ─────────────────────────────────────────────────────────
export const createFuelLog = async (req, res) => {
  try {
    const { vehicleId, tripId, liters, cost, date } = req.body;

    if (!vehicleId || liters === undefined || cost === undefined) {
      return res.status(400).json({ message: "Vehicle ID, liters, and cost are required." });
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found." });

    if (tripId) {
      const trip = await prisma.trip.findUnique({ where: { id: tripId } });
      if (!trip) return res.status(404).json({ message: "Trip not found." });
    }

    const fuelLog = await prisma.fuelLog.create({
      data: {
        vehicleId,
        tripId: tripId || null,
        liters: parseFloat(liters),
        cost: parseFloat(cost),
        date: date ? new Date(date) : new Date(),
      },
    });

    return res.status(201).json({ message: "Fuel log recorded successfully.", fuelLog });
  } catch (error) {
    console.error("[CREATE FUEL LOG ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ─── GET FUEL LOGS ───────────────────────────────────────────────────────────
export const getFuelLogs = async (req, res) => {
  try {
    const { vehicleId } = req.query;
    const where = vehicleId ? { vehicleId } : {};

    const fuelLogs = await prisma.fuelLog.findMany({
      where,
      include: {
        vehicle: { select: { registrationNumber: true, name: true } },
        trip: { select: { source: true, destination: true } },
      },
      orderBy: { date: "desc" },
    });

    return res.json({ fuelLogs });
  } catch (error) {
    console.error("[GET FUEL LOGS ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ─── CREATE EXPENSE ──────────────────────────────────────────────────────────
export const createExpense = async (req, res) => {
  try {
    const { vehicleId, type, amount, description, date } = req.body;

    if (!vehicleId || !type || amount === undefined) {
      return res.status(400).json({ message: "Vehicle ID, type, and amount are required." });
    }

    const validTypes = ["TOLL", "MAINTENANCE", "OTHER"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid expense type." });
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found." });

    const expense = await prisma.expense.create({
      data: {
        vehicleId,
        type,
        amount: parseFloat(amount),
        description: description || null,
        date: date ? new Date(date) : new Date(),
      },
    });

    return res.status(201).json({ message: "Expense recorded successfully.", expense });
  } catch (error) {
    console.error("[CREATE EXPENSE ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ─── GET EXPENSES ────────────────────────────────────────────────────────────
export const getExpenses = async (req, res) => {
  try {
    const { vehicleId, type } = req.query;
    const where = {};
    if (vehicleId) where.vehicleId = vehicleId;
    if (type) where.type = type;

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        vehicle: { select: { registrationNumber: true, name: true } },
      },
      orderBy: { date: "desc" },
    });

    return res.json({ expenses });
  } catch (error) {
    console.error("[GET EXPENSES ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ─── GET OPERATIONAL COST PER VEHICLE ────────────────────────────────────────
// Computes total operational cost: Fuel + Maintenance + Expenses
export const getVehicleOperationalCost = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found." });

    // Sum fuel logs cost
    const fuelSum = await prisma.fuelLog.aggregate({
      where: { vehicleId },
      _sum: { cost: true },
    });

    // Sum maintenance logs cost
    const maintenanceSum = await prisma.maintenanceLog.aggregate({
      where: { vehicleId },
      _sum: { cost: true },
    });

    // Sum other general expenses (like Tolls or manual expenses)
    const expenseSum = await prisma.expense.aggregate({
      where: { vehicleId },
      _sum: { amount: true },
    });

    const totalFuelCost = fuelSum._sum.cost || 0;
    const totalMaintenanceCost = maintenanceSum._sum.cost || 0;
    const totalOtherExpenseCost = expenseSum._sum.amount || 0;
    const totalOperationalCost = totalFuelCost + totalMaintenanceCost + totalOtherExpenseCost;

    return res.json({
      vehicleId,
      vehicleName: vehicle.name,
      registrationNumber: vehicle.registrationNumber,
      breakdown: {
        fuel: totalFuelCost,
        maintenance: totalMaintenanceCost,
        otherExpenses: totalOtherExpenseCost,
      },
      totalOperationalCost,
    });
  } catch (error) {
    console.error("[GET OPERATIONAL COST ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

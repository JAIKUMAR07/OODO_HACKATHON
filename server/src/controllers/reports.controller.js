import { prisma } from "../config/db.js";

// ─── GET REPORTS & ANALYTICS SUMMARY ─────────────────────────────────────────
export const getAnalyticsSummary = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { status: { not: "RETIRED" } },
      include: {
        trips: { where: { status: "COMPLETED" } },
        maintenanceLogs: true,
        fuelLogs: true,
        expenses: true,
      },
    });

    const reportData = vehicles.map((vehicle) => {
      // 1. Total Distance and Fuel Efficiency (Distance / Fuel)
      const totalDistance = vehicle.trips.reduce((sum, trip) => sum + (trip.actualDistance || trip.plannedDistance || 0), 0);
      const totalFuelLiters = vehicle.fuelLogs.reduce((sum, log) => sum + log.liters, 0);
      const fuelEfficiency = totalFuelLiters > 0 ? (totalDistance / totalFuelLiters) : 0;

      // 2. Operational Cost Breakdown
      const totalFuelCost = vehicle.fuelLogs.reduce((sum, log) => sum + log.cost, 0);
      const totalMaintenanceCost = vehicle.maintenanceLogs.reduce((sum, log) => sum + log.cost, 0);
      const totalOtherExpenses = vehicle.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const totalOperationalCost = totalFuelCost + totalMaintenanceCost + totalOtherExpenses;

      // 3. Dynamic Revenue Estimation (per-km rate + per-kg cargo rate)
      const revenue = vehicle.trips.reduce((sum, trip) => {
        const dist = trip.actualDistance || trip.plannedDistance || 0;
        const cargo = trip.cargoWeight || 0;
        return sum + (dist * 30) + (cargo * 0.5); // Assumption: $30 per km + $0.50 per kg cargo weight
      }, 0);

      // 4. Vehicle ROI: (Revenue - Operational Cost) / Acquisition Cost
      const netProfit = revenue - totalOperationalCost;
      const roi = vehicle.acquisitionCost > 0 ? (netProfit / vehicle.acquisitionCost) * 100 : 0;

      return {
        id: vehicle.id,
        name: vehicle.name,
        registrationNumber: vehicle.registrationNumber,
        type: vehicle.type,
        status: vehicle.status,
        acquisitionCost: vehicle.acquisitionCost,
        metrics: {
          totalDistance: parseFloat(totalDistance.toFixed(1)),
          fuelEfficiency: parseFloat(fuelEfficiency.toFixed(2)),
          totalFuelLiters: parseFloat(totalFuelLiters.toFixed(1)),
        },
        costs: {
          fuel: parseFloat(totalFuelCost.toFixed(2)),
          maintenance: parseFloat(totalMaintenanceCost.toFixed(2)),
          otherExpenses: parseFloat(totalOtherExpenses.toFixed(2)),
          total: parseFloat(totalOperationalCost.toFixed(2)),
        },
        revenue: parseFloat(revenue.toFixed(2)),
        roi: parseFloat(roi.toFixed(2)), // in %
      };
    });

    // 5. Fleet-wide summary metrics
    const totalVehiclesCount = vehicles.length;
    const activeVehicles = vehicles.filter(v => v.status === "AVAILABLE" || v.status === "ON_TRIP").length;
    const fleetUtilization = totalVehiclesCount > 0 ? (vehicles.filter(v => v.status === "ON_TRIP").length / totalVehiclesCount) * 100 : 0;

    const totalOperationalCostAll = reportData.reduce((sum, v) => sum + v.costs.total, 0);
    const totalRevenueAll = reportData.reduce((sum, v) => sum + v.revenue, 0);
    const avgFuelEfficiencyAll = reportData.length > 0 ? reportData.reduce((sum, v) => sum + v.metrics.fuelEfficiency, 0) / reportData.length : 0;
    
    // Overall Fleet ROI = (Total Revenue - Total Cost) / Total Acquisition Cost
    const totalAcquisitionCost = vehicles.reduce((sum, v) => sum + v.acquisitionCost, 0);
    const overallRoi = totalAcquisitionCost > 0 ? ((totalRevenueAll - totalOperationalCostAll) / totalAcquisitionCost) * 100 : 0;

    // 6. Top Costliest Vehicles (by operational cost)
    const topCostliestVehicles = [...reportData]
      .sort((a, b) => b.costs.total - a.costs.total)
      .slice(0, 5)
      .map(v => ({
        name: v.name,
        registrationNumber: v.registrationNumber,
        cost: v.costs.total,
      }));

    // 7. Monthly Revenue (group completed trips by month for the last 6 months)
    const monthlyRevenueMap = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Initialize past 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      monthlyRevenueMap[key] = 0;
    }

    vehicles.forEach(vehicle => {
      vehicle.trips.forEach(trip => {
        if (trip.completedAt) {
          const date = new Date(trip.completedAt);
          const key = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
          if (monthlyRevenueMap[key] !== undefined) {
            const dist = trip.actualDistance || trip.plannedDistance || 0;
            const cargo = trip.cargoWeight || 0;
            const tripRevenue = (dist * 30) + (cargo * 0.5);
            monthlyRevenueMap[key] += tripRevenue;
          }
        }
      });
    });

    const monthlyRevenue = Object.entries(monthlyRevenueMap).map(([month, amount]) => ({
      month,
      amount: parseFloat(amount.toFixed(2)),
    }));

    return res.json({
      summary: {
        totalVehicles: totalVehiclesCount,
        activeVehicles,
        fleetUtilization: parseFloat(fleetUtilization.toFixed(1)),
        totalOperationalCost: parseFloat(totalOperationalCostAll.toFixed(2)),
        totalRevenue: parseFloat(totalRevenueAll.toFixed(2)),
        avgFuelEfficiency: parseFloat(avgFuelEfficiencyAll.toFixed(2)),
        overallRoi: parseFloat(overallRoi.toFixed(2)),
      },
      topCostliestVehicles,
      monthlyRevenue,
      vehicles: reportData,
    });
  } catch (error) {
    console.error("[GET ANALYTICS SUMMARY ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// ─── EXPORT ANALYTICS AS CSV ─────────────────────────────────────────────────
export const exportAnalyticsCSV = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { status: { not: "RETIRED" } },
      include: {
        trips: { where: { status: "COMPLETED" } },
        maintenanceLogs: true,
        fuelLogs: true,
        expenses: true,
      },
    });

    // CSV Headers
    let csvContent = "Registration Number,Model Name,Vehicle Type,Status,Acquisition Cost,Total Distance (km),Fuel Efficiency (km/L),Fuel Cost,Maintenance Cost,Other Expenses,Total Operational Cost,Estimated Revenue,ROI (%)\n";

    vehicles.forEach((vehicle) => {
      const totalDistance = vehicle.trips.reduce((sum, trip) => sum + (trip.actualDistance || trip.plannedDistance || 0), 0);
      const totalFuelLiters = vehicle.fuelLogs.reduce((sum, log) => sum + log.liters, 0);
      const fuelEfficiency = totalFuelLiters > 0 ? (totalDistance / totalFuelLiters) : 0;

      const totalFuelCost = vehicle.fuelLogs.reduce((sum, log) => sum + log.cost, 0);
      const totalMaintenanceCost = vehicle.maintenanceLogs.reduce((sum, log) => sum + log.cost, 0);
      const totalOtherExpenses = vehicle.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const totalOperationalCost = totalFuelCost + totalMaintenanceCost + totalOtherExpenses;

      const revenue = vehicle.trips.reduce((sum, trip) => {
        const dist = trip.actualDistance || trip.plannedDistance || 0;
        const cargo = trip.cargoWeight || 0;
        return sum + (dist * 30) + (cargo * 0.5);
      }, 0);

      const netProfit = revenue - totalOperationalCost;
      const roi = vehicle.acquisitionCost > 0 ? (netProfit / vehicle.acquisitionCost) * 100 : 0;

      // Add Row
      csvContent += `${vehicle.registrationNumber},"${vehicle.name}",${vehicle.type},${vehicle.status},${vehicle.acquisitionCost.toFixed(2)},${totalDistance.toFixed(1)},${fuelEfficiency.toFixed(2)},${totalFuelCost.toFixed(2)},${totalMaintenanceCost.toFixed(2)},${totalOtherExpenses.toFixed(2)},${totalOperationalCost.toFixed(2)},${revenue.toFixed(2)},${roi.toFixed(2)}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=fleet_analytics_report.csv");
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error("[EXPORT CSV ERROR]", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

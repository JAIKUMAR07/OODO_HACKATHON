import { prisma } from "../config/db.js";

export const dashboardService = {
  async getDashboardKPIs() {
    const totalVehicles = await prisma.vehicle.count();
    const statusCounts = await prisma.vehicle.groupBy({
      by: ['status'],
      _count: { _all: true }
    });

    let availableVehicles = 0;
    let onTripVehicles = 0;
    let maintenanceVehicles = 0;
    let retiredVehicles = 0;

    statusCounts.forEach(item => {
      if (item.status === "AVAILABLE") availableVehicles = item._count._all;
      if (item.status === "ON_TRIP") onTripVehicles = item._count._all;
      if (item.status === "IN_SHOP") maintenanceVehicles = item._count._all;
      if (item.status === "RETIRED") retiredVehicles = item._count._all;
    });

    const activeVehicles = availableVehicles + onTripVehicles + maintenanceVehicles;

    const activeTrips = await prisma.trip.count({
      where: { status: "DISPATCHED" }
    });

    const pendingTrips = await prisma.trip.count({
      where: { status: { in: ["DRAFT", "ASSIGNED"] } }
    });

    const driversOnDuty = await prisma.driver.count({
      where: { status: { in: ["AVAILABLE", "ON_TRIP"] } }
    });

    const fleetUtilization = activeVehicles > 0 ? Math.round((onTripVehicles / activeVehicles) * 100) : 0;

    return {
      activeVehicles,
      availableVehicles,
      maintenanceVehicles,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilization
    };
  },

  async getVehicleStatusChart() {
    const statusCounts = await prisma.vehicle.groupBy({
      by: ['status'],
      _count: { _all: true }
    });
    
    return statusCounts.map(item => ({
      status: item.status,
      count: item._count._all
    }));
  },

  async getRecentVehicles(limit = 5) {
    return await prisma.vehicle.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        registrationNumber: true,
        status: true,
        createdAt: true
      }
    });
  }
};

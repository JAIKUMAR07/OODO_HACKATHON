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

    return {
      totalVehicles,
      availableVehicles,
      onTripVehicles,
      maintenanceVehicles,
      retiredVehicles
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

import { vehicleRepository } from "../repositories/vehicle.repository.js";

export const dashboardService = {
  async getDashboardKPIs() {
    const totalVehicles = await vehicleRepository.countTotal();
    const statusCounts = await vehicleRepository.countByStatus();

    // Initialize with 0
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
    const statusCounts = await vehicleRepository.countByStatus();
    
    return statusCounts.map(item => ({
      status: item.status,
      count: item._count._all
    }));
  },

  async getRecentVehicles(limit = 5) {
    return await vehicleRepository.getRecent(limit);
  }
};

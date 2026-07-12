import { prisma } from "../config/db.js";
import { AppError } from "../utils/AppError.js";

export const driverService = {
  async getAvailableDrivers() {
    return await prisma.driver.findMany({
      where: { status: "AVAILABLE" },
      select: {
        id: true,
        name: true,
        licenseNumber: true,
        licenseCategory: true,
        safetyScore: true
      }
    });
  },

  async validateDriverForTrip(id) {
    const driver = await prisma.driver.findUnique({
      where: { id }
    });
    
    if (!driver) {
      throw new AppError("Driver not found", 404);
    }

    if (driver.status !== "AVAILABLE") {
      throw new AppError(`Driver is currently ${driver.status}, cannot assign to trip`, 400);
    }

    // License expiry check
    if (new Date(driver.licenseExpiryDate) < new Date()) {
      throw new AppError("Driver's license is expired", 400);
    }

    return driver;
  },

  async changeStatus(id, newStatus) {
    return await prisma.driver.update({
      where: { id },
      data: { status: newStatus }
    });
  }
};

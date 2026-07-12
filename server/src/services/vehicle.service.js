import { prisma } from "../config/db.js";
import { AppError } from "../utils/AppError.js";

export const vehicleService = {
  async registerVehicle(data) {
    const existing = await prisma.vehicle.findUnique({
      where: { registrationNumber: data.registrationNumber }
    });
    if (existing) {
      throw new AppError(`Vehicle with registration ${data.registrationNumber} already exists`, 409);
    }

    return await prisma.vehicle.create({ data });
  },

  async getVehicles(query) {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.max(1, parseInt(query.limit) || 10);
    const { status, type, search } = query;
    const skip = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;
    if (type) where.type = type;
    if (search) {
      where.registrationNumber = {
        contains: search,
        mode: "insensitive",
      };
    }

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.vehicle.count({ where }),
    ]);

    return { vehicles, total };
  },

  async getVehicleById(id) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) {
      throw new AppError("Vehicle not found", 404);
    }
    return vehicle;
  },

  async updateVehicle(id, data) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) {
      throw new AppError("Vehicle not found", 404);
    }

    if (data.odometer !== undefined && data.odometer < vehicle.odometer) {
      throw new AppError(`Odometer cannot decrease. Old: ${vehicle.odometer}, New: ${data.odometer}`, 400);
    }

    if (vehicle.status === "RETIRED" && data.status === "ON_TRIP") {
      throw new AppError("A retired vehicle cannot be assigned to a trip", 400);
    }

    return await prisma.vehicle.update({ where: { id }, data });
  },

  async retireVehicle(id) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) {
      throw new AppError("Vehicle not found", 404);
    }
    
    if (vehicle.status === "RETIRED") {
      return vehicle;
    }

    return await prisma.vehicle.update({
      where: { id },
      data: { status: "RETIRED" }
    });
  },
  
  async changeStatus(id, newStatus) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) {
      throw new AppError("Vehicle not found", 404);
    }
    
    if (vehicle.status === "RETIRED" && newStatus === "ON_TRIP") {
      throw new AppError("A retired vehicle cannot be assigned to a trip", 400);
    }

    return await prisma.vehicle.update({
      where: { id },
      data: { status: newStatus }
    });
  }
};

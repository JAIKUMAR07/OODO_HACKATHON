import { prisma } from "../config/db.js";

export const vehicleRepository = {
  async create(data) {
    return await prisma.vehicle.create({
      data,
    });
  },

  async findByRegistration(registrationNumber) {
    return await prisma.vehicle.findUnique({
      where: { registrationNumber },
    });
  },

  async findById(id) {
    return await prisma.vehicle.findUnique({
      where: { id },
    });
  },

  async findAll({ page, limit, status, type, search }) {
    const skip = (page - 1) * limit;
    const where = {};

    if (status) {
      where.status = status;
    }
    if (type) {
      where.type = type;
    }
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

  async update(id, data) {
    return await prisma.vehicle.update({
      where: { id },
      data,
    });
  },

  // Dashboard Aggregations
  async countByStatus() {
    return await prisma.vehicle.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
    });
  },

  async countTotal() {
    return await prisma.vehicle.count();
  },

  async getRecent(take = 5) {
    return await prisma.vehicle.findMany({
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        registrationNumber: true,
        name: true,
        type: true,
        status: true,
        createdAt: true
      }
    });
  }
};

import { prisma } from "../config/db.js";
import { vehicleService } from "./vehicle.service.js";
import { driverService } from "./driver.service.js";
import { AppError } from "../utils/AppError.js";

export const tripService = {
  async createDraft(data) {
    return await prisma.trip.create({
      data: {
        source: data.source,
        destination: data.destination,
        cargoWeight: data.cargoWeight,
        plannedDistance: data.plannedDistance,
        status: "DRAFT"
      },
      include: { vehicle: true, driver: true }
    });
  },

  async getTrips(query) {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.max(1, parseInt(query.limit) || 10);
    const { status, vehicleId, driverId } = query;
    const skip = (page - 1) * limit;
    const where = {};
    if (status) where.status = status;
    if (vehicleId) where.vehicleId = vehicleId;
    if (driverId) where.driverId = driverId;

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          vehicle: { select: { name: true, registrationNumber: true } },
          driver: { select: { name: true, contactNumber: true } }
        }
      }),
      prisma.trip.count({ where })
    ]);

    return { trips, total };
  },

  async getTripById(id) {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { vehicle: true, driver: true }
    });
    if (!trip) throw new AppError("Trip not found", 404);
    return trip;
  },

  async assignTrip(tripId, vehicleId, driverId) {
    const trip = await this.getTripById(tripId);

    if (trip.status !== "DRAFT" && trip.status !== "ASSIGNED") {
      throw new AppError(`Cannot assign a trip in ${trip.status} state`, 400);
    }

    const vehicle = await vehicleService.getVehicleById(vehicleId);
    if (vehicle.status !== "AVAILABLE") {
      throw new AppError(`Vehicle is currently ${vehicle.status}, cannot assign`, 400);
    }
    if (vehicle.maxLoadCapacity < trip.cargoWeight) {
      throw new AppError(`Vehicle capacity (${vehicle.maxLoadCapacity}kg) is less than cargo weight (${trip.cargoWeight}kg)`, 400);
    }

    const driver = await driverService.validateDriverForTrip(driverId);

    return await prisma.trip.update({
      where: { id: tripId },
      data: {
        vehicleId: vehicle.id,
        driverId: driver.id,
        status: "ASSIGNED"
      },
      include: { vehicle: true, driver: true }
    });
  },

  async dispatchTrip(tripId) {
    const trip = await this.getTripById(tripId);

    if (trip.status !== "ASSIGNED") {
      throw new AppError(`Trip must be ASSIGNED to be dispatched. Currently: ${trip.status}`, 400);
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: {
        status: "DISPATCHED",
        dispatchedAt: new Date(),
        startOdometer: trip.vehicle.odometer
      },
      include: { vehicle: true, driver: true }
    });

    await vehicleService.changeStatus(trip.vehicleId, "ON_TRIP");
    await driverService.changeStatus(trip.driverId, "ON_TRIP");

    return updatedTrip;
  },

  async completeTrip(tripId, endOdometer, fuelConsumed, actualDistance) {
    const trip = await this.getTripById(tripId);

    if (trip.status !== "DISPATCHED") {
      throw new AppError(`Trip must be DISPATCHED to be completed. Currently: ${trip.status}`, 400);
    }

    if (endOdometer < trip.startOdometer) {
      throw new AppError(`End odometer (${endOdometer}) cannot be less than start odometer (${trip.startOdometer})`, 400);
    }

    const distanceTraveled = actualDistance || (endOdometer - trip.startOdometer);

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        endOdometer,
        fuelConsumed,
        actualDistance: distanceTraveled
      },
      include: { vehicle: true, driver: true }
    });

    await vehicleService.updateVehicle(trip.vehicleId, { 
      status: "AVAILABLE",
      odometer: endOdometer
    });
    
    await driverService.changeStatus(trip.driverId, "AVAILABLE");

    if (fuelConsumed && fuelConsumed > 0) {
      await prisma.fuelLog.create({
        data: {
          vehicleId: trip.vehicleId,
          tripId: trip.id,
          liters: fuelConsumed,
          cost: 0 
        }
      });
    }

    return updatedTrip;
  },

  async cancelTrip(tripId) {
    const trip = await this.getTripById(tripId);

    if (trip.status === "COMPLETED" || trip.status === "CANCELLED") {
      throw new AppError(`Cannot cancel a trip that is already ${trip.status}`, 400);
    }

    if (trip.status === "DISPATCHED") {
      await vehicleService.changeStatus(trip.vehicleId, "AVAILABLE");
      await driverService.changeStatus(trip.driverId, "AVAILABLE");
    }

    return await prisma.trip.update({
      where: { id: tripId },
      data: { status: "CANCELLED" },
      include: { vehicle: true, driver: true }
    });
  }
};

import { vehicleRepository } from "../repositories/vehicle.repository.js";

export const vehicleService = {
  async registerVehicle(data) {
    // Rule 1: Registration number must be unique
    const existing = await vehicleRepository.findByRegistration(data.registrationNumber);
    if (existing) {
      throw new Error(`Vehicle with registration ${data.registrationNumber} already exists`);
    }

    return await vehicleRepository.create(data);
  },

  async getVehicles(query) {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.max(1, parseInt(query.limit) || 10);
    const { status, type, search } = query;

    return await vehicleRepository.findAll({ page, limit, status, type, search });
  },

  async getVehicleById(id) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }
    return vehicle;
  },

  async updateVehicle(id, data) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    // Rule 4: Odometer cannot decrease
    if (data.odometer !== undefined && data.odometer < vehicle.odometer) {
      throw new Error(`Odometer cannot decrease. Old: ${vehicle.odometer}, New: ${data.odometer}`);
    }

    // Rule 5: Retired vehicle cannot become ON_TRIP
    if (vehicle.status === "RETIRED" && data.status === "ON_TRIP") {
      throw new Error("A retired vehicle cannot be assigned to a trip");
    }

    return await vehicleRepository.update(id, data);
  },

  async retireVehicle(id) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }
    
    if (vehicle.status === "RETIRED") {
      return vehicle; // already retired
    }

    // Soft delete: change status to RETIRED
    return await vehicleRepository.update(id, { status: "RETIRED" });
  },
  
  async changeStatus(id, newStatus) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }
    
    if (vehicle.status === "RETIRED" && newStatus === "ON_TRIP") {
      throw new Error("A retired vehicle cannot be assigned to a trip");
    }

    return await vehicleRepository.update(id, { status: newStatus });
  }
};

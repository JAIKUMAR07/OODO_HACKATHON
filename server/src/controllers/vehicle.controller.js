import { vehicleService } from "../services/vehicle.service.js";

export const createVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.registerVehicle(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    if (error.message.includes("already exists")) {
      return res.status(409).json({ message: error.message });
    }
    next(error);
  }
};

export const getVehicles = async (req, res, next) => {
  try {
    const data = await vehicleService.getVehicles(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getSingleVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};

export const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};

export const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.retireVehicle(req.params.id);
    res.json({ message: "Vehicle retired successfully", vehicle });
  } catch (error) {
    if (error.message === "Vehicle not found") {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

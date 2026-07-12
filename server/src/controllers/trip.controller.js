import { tripService } from "../services/trip.service.js";

export const createDraftTrip = async (req, res, next) => {
  try {
    const trip = await tripService.createDraft(req.body);
    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
};

export const getTrips = async (req, res, next) => {
  try {
    const data = await tripService.getTrips(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getSingleTrip = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.params.id);
    res.json(trip);
  } catch (error) {
    next(error);
  }
};

export const assignTrip = async (req, res, next) => {
  try {
    const { vehicleId, driverId } = req.body;
    const trip = await tripService.assignTrip(req.params.id, vehicleId, driverId);
    res.json(trip);
  } catch (error) {
    next(error);
  }
};

export const dispatchTrip = async (req, res, next) => {
  try {
    const trip = await tripService.dispatchTrip(req.params.id);
    res.json(trip);
  } catch (error) {
    next(error);
  }
};

export const completeTrip = async (req, res, next) => {
  try {
    const { endOdometer, fuelConsumed, actualDistance } = req.body;
    const trip = await tripService.completeTrip(req.params.id, endOdometer, fuelConsumed, actualDistance);
    res.json(trip);
  } catch (error) {
    next(error);
  }
};

export const cancelTrip = async (req, res, next) => {
  try {
    const trip = await tripService.cancelTrip(req.params.id);
    res.json(trip);
  } catch (error) {
    next(error);
  }
};

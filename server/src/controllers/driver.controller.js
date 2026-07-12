import { driverService } from "../services/driver.service.js";

export const getAvailableDrivers = async (req, res, next) => {
  try {
    const drivers = await driverService.getAvailableDrivers();
    res.json(drivers);
  } catch (error) {
    next(error);
  }
};

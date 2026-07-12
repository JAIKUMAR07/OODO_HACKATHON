import { dashboardService } from "../services/dashboard.service.js";

export const getKPIs = async (req, res, next) => {
  try {
    const kpis = await dashboardService.getDashboardKPIs();
    res.json(kpis);
  } catch (error) {
    next(error);
  }
};

export const getVehicleStatus = async (req, res, next) => {
  try {
    const statusChart = await dashboardService.getVehicleStatusChart();
    res.json(statusChart);
  } catch (error) {
    next(error);
  }
};

export const getRecentVehicles = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const recent = await dashboardService.getRecentVehicles(limit);
    res.json(recent);
  } catch (error) {
    next(error);
  }
};

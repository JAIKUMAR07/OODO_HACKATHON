import { AppError } from "../utils/AppError.js";

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError("Forbidden: You do not have permission", 403));
    }

    next();
  };
};

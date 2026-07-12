import { z } from "zod";

export const createVehicleSchema = z.object({
  registrationNumber: z.string().min(1, "Registration number is required"),
  name: z.string().min(1, "Vehicle name is required"),
  type: z.string().min(1, "Vehicle type is required"),
  maxLoadCapacity: z.number().nonnegative("Capacity cannot be negative"),
  odometer: z.number().nonnegative("Odometer cannot be negative").default(0),
  acquisitionCost: z.number().nonnegative("Acquisition cost cannot be negative"),
  status: z.enum(["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"]).default("AVAILABLE"),
});

export const updateVehicleSchema = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  maxLoadCapacity: z.number().nonnegative("Capacity cannot be negative").optional(),
  odometer: z.number().nonnegative("Odometer cannot be negative").optional(),
  status: z.enum(["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"]).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
});

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.errors.map((e) => ({ field: e.path.join("."), message: e.message })),
      });
    }
    next(error);
  }
};

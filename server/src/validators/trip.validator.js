import { z } from "zod";

export const createTripSchema = z.object({
  source: z.string().min(1, "Source is required"),
  destination: z.string().min(1, "Destination is required"),
  cargoWeight: z.number().positive("Cargo weight must be positive"),
  plannedDistance: z.number().positive("Planned distance must be positive"),
});

export const assignTripSchema = z.object({
  vehicleId: z.string().uuid("Invalid vehicle ID"),
  driverId: z.string().uuid("Invalid driver ID"),
});

export const completeTripSchema = z.object({
  endOdometer: z.number().nonnegative("End odometer cannot be negative"),
  fuelConsumed: z.number().nonnegative("Fuel consumed cannot be negative"),
  actualDistance: z.number().positive("Actual distance must be positive").optional(),
});

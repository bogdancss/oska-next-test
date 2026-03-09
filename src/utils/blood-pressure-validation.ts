import { z } from "zod";
import type { BloodPressureReading } from "../db/types";

export const bloodPressureReadingInputSchema = z.object({
  systolic: z
    .number({
      required_error: "Systolic is required",
      invalid_type_error: "Systolic is required",
    })
    .int("Systolic must be a whole number")
    .min(50, "Systolic must be above 50")
    .max(300, "Systolic must be below 300"),
  diastolic: z
    .number({
      required_error: "Diastolic is required",
      invalid_type_error: "Diastolic is required",
    })
    .int("Diastolic must be a whole number")
    .min(30, "Diastolic must be above 30")
    .max(200, "Diastolic must be below 200"),
});

export type BloodPressureReadingInput = z.infer<
  typeof bloodPressureReadingInputSchema
>;

export interface HistoricalValidationError {
  field: "systolic" | "diastolic";
  message: string;
}

function average(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function validateAgainstHistory(
  input: BloodPressureReadingInput,
  recentReadings: BloodPressureReading[],
): HistoricalValidationError[] {
  if (recentReadings.length === 0) return [];

  const last5 = recentReadings.slice(0, 5);
  const errors: HistoricalValidationError[] = [];

  const avgSystolic = average(last5.map((r) => r.systolic));
  if (Math.abs(input.systolic - avgSystolic) > avgSystolic * 0.3) {
    errors.push({
      field: "systolic",
      message: `Systolic reading is outside 30% of the recent average (${Math.round(avgSystolic)})`,
    });
  }

  const avgDiastolic = average(last5.map((r) => r.diastolic));
  if (Math.abs(input.diastolic - avgDiastolic) > avgDiastolic * 0.15) {
    errors.push({
      field: "diastolic",
      message: `Diastolic reading is outside 15% of the recent average (${Math.round(avgDiastolic)})`,
    });
  }

  return errors;
}

export function getBloodPressureWarning(systolic: number): string | null {
  if (systolic >= 180)
    return "Your blood pressure is higher than normal, contact your doctor immediately";
  if (systolic >= 160)
    return "Your blood pressure is higher than normal, contact your doctor";
  if (systolic >= 140)
    return "Your blood pressure is higher than normal, contact your health coach";
  return null;
}

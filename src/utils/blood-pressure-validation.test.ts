import type { BloodPressureReading } from "@/db/types";
import { describe, expect, test } from "vitest";
import {
  bloodPressureReadingInputSchema,
  getBloodPressureWarning,
  validateAgainstHistory,
} from "./blood-pressure-validation";

describe("bloodPressureReadingInputSchema", () => {
  test("accepts valid input", () => {
    expect(
      bloodPressureReadingInputSchema.parse({ systolic: 120, diastolic: 80 }),
    ).toEqual({ systolic: 120, diastolic: 80 });
  });

  test("rejects out-of-range values", () => {
    expect(
      bloodPressureReadingInputSchema.safeParse({ systolic: 49, diastolic: 80 })
        .success,
    ).toBe(false);
    expect(
      bloodPressureReadingInputSchema.safeParse({
        systolic: 301,
        diastolic: 80,
      }).success,
    ).toBe(false);
    expect(
      bloodPressureReadingInputSchema.safeParse({
        systolic: 120,
        diastolic: 29,
      }).success,
    ).toBe(false);
  });

  test("rejects decimals", () => {
    expect(
      bloodPressureReadingInputSchema.safeParse({
        systolic: 120.5,
        diastolic: 80,
      }).success,
    ).toBe(false);
  });

  test("rejects missing fields", () => {
    expect(bloodPressureReadingInputSchema.safeParse({}).success).toBe(false);
    expect(
      bloodPressureReadingInputSchema.safeParse({ systolic: 120 }).success,
    ).toBe(false);
  });
});

function makeReading(
  overrides: Partial<BloodPressureReading> & {
    systolic: number;
    diastolic: number;
  },
): BloodPressureReading {
  return {
    id: 1,
    userId: 1,
    createdAt: new Date(),
    ...overrides,
  };
}

describe("validateAgainstHistory", () => {
  test("skips validation when there are no previous readings", () => {
    const errors = validateAgainstHistory(
      { systolic: 200, diastolic: 120 },
      [],
    );
    expect(errors).toEqual([]);
  });

  test("passes when reading is within thresholds", () => {
    const readings = [
      makeReading({ systolic: 120, diastolic: 80 }),
      makeReading({ systolic: 118, diastolic: 82 }),
      makeReading({ systolic: 122, diastolic: 78 }),
    ];
    const errors = validateAgainstHistory(
      { systolic: 125, diastolic: 82 },
      readings,
    );
    expect(errors).toEqual([]);
  });

  test("rejects systolic outside 30% of average", () => {
    const readings = [
      makeReading({ systolic: 100, diastolic: 80 }),
      makeReading({ systolic: 100, diastolic: 80 }),
      makeReading({ systolic: 100, diastolic: 80 }),
    ];
    const errors = validateAgainstHistory(
      { systolic: 131, diastolic: 80 },
      readings,
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]!.field).toBe("systolic");
  });

  test("rejects diastolic outside 15% of average", () => {
    const readings = [
      makeReading({ systolic: 120, diastolic: 80 }),
      makeReading({ systolic: 120, diastolic: 80 }),
    ];
    const errors = validateAgainstHistory(
      { systolic: 120, diastolic: 93 },
      readings,
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]!.field).toBe("diastolic");
  });

  test("only uses the 5 most recent readings", () => {
    const readings = [
      makeReading({ id: 6, systolic: 150, diastolic: 90 }),
      makeReading({ id: 5, systolic: 150, diastolic: 90 }),
      makeReading({ id: 4, systolic: 150, diastolic: 90 }),
      makeReading({ id: 3, systolic: 150, diastolic: 90 }),
      makeReading({ id: 2, systolic: 150, diastolic: 90 }),
      makeReading({ id: 1, systolic: 50, diastolic: 30 }),
    ];
    const errors = validateAgainstHistory(
      { systolic: 155, diastolic: 88 },
      readings,
    );
    expect(errors).toEqual([]);
  });
});

describe("getBloodPressureWarning", () => {
  test("returns null for normal readings", () => {
    expect(getBloodPressureWarning(120)).toBeNull();
    expect(getBloodPressureWarning(139)).toBeNull();
  });

  test("returns appropriate warning per threshold", () => {
    expect(getBloodPressureWarning(145)).toContain("health coach");
    expect(getBloodPressureWarning(165)).toContain("contact your doctor");
    expect(getBloodPressureWarning(185)).toContain("immediately");
  });
});

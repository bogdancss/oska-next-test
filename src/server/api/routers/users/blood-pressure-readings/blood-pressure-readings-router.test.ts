import { db } from "@/db";
import type { BloodPressureReading } from "@/db/types";
import { describe, expect, test } from "vitest";
import { createCaller } from "../../../root";

async function createTestCaller() {
  return createCaller({ headers: new Headers() });
}

describe("users.bloodPressureReadings.list", () => {
  test("returns readings for a user", async () => {
    const caller = await createTestCaller();

    const reading: BloodPressureReading = {
      id: 1,
      userId: 1,
      createdAt: new Date("2026-01-01"),
      systolic: 120,
      diastolic: 80,
    };

    db.bloodPressureReadings.reset({
      bloodPressureReadings: [reading],
    });

    const response = await caller.users.bloodPressureReadings.list({
      userId: 1,
    });

    expect(response.items).toEqual([reading]);
  });
});

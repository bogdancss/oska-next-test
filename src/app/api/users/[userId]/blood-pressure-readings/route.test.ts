import { db } from "@/db";
import type { BloodPressureReading } from "@/db/types";
import { describe, expect, test } from "vitest";
import { z } from "zod";
import { GET } from "./route";

function createParams({ userId }: { userId: string }) {
  return Promise.resolve({ userId: userId.toString() });
}

const bloodPressureReadingSchema = z.object({
  id: z.number(),
  userId: z.number(),
  createdAt: z.coerce.date(),
  systolic: z.number(),
  diastolic: z.number(),
});

const responseSchema = z.object({
  items: z.array(bloodPressureReadingSchema),
});

describe("blood-pressure-readings API", () => {
  describe("GET", () => {
    test("returns readings for a user", async () => {
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

      const request = new Request(
        "http://localhost/api/users/1/blood-pressure-readings",
      );
      const params = createParams({ userId: "1" });

      const response = await GET(request, {
        params,
      } satisfies RouteContext<"/api/users/[userId]/blood-pressure-readings">);
      const data = responseSchema.parse(await response.json());

      expect(response.status).toBe(200);
      expect(data.items).toEqual([reading]);
    });
  });
});

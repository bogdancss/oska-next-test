import { db } from "@/db";
import type { BloodPressureReading } from "@/db/types";
import type { SerializedBloodPressureReading } from "@/utils/blood-pressure-readings";
import { beforeEach, describe, expect, test } from "vitest";
import { GET, POST } from "./route";

interface GetResponse {
  items: SerializedBloodPressureReading[];
}

interface PostSuccess {
  reading: SerializedBloodPressureReading;
  warning?: string;
}

interface PostError {
  errors: Record<string, string[]>;
}

type Ctx = RouteContext<"/api/users/[userId]/blood-pressure-readings">;

function createCtx(userId: string): Ctx {
  return { params: Promise.resolve({ userId }) };
}

function postRequest(body: unknown) {
  return new Request(
    "http://localhost/api/users/1/blood-pressure-readings",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
}

describe("blood-pressure-readings API", () => {
  beforeEach(() => {
    db.bloodPressureReadings.reset({ bloodPressureReadings: [] });
  });

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
      const response = await GET(request, createCtx("1"));
      const data = (await response.json()) as GetResponse;

      expect(response.status).toBe(200);
      expect(data.items).toHaveLength(1);
      expect(data.items[0]?.systolic).toBe(120);
    });
  });

  describe("POST", () => {
    test("creates a reading and returns 201", async () => {
      const response = await POST(
        postRequest({ systolic: 120, diastolic: 80 }),
        createCtx("1"),
      );
      const data = (await response.json()) as PostSuccess;

      expect(response.status).toBe(201);
      expect(data.reading.systolic).toBe(120);
      expect(data.reading.userId).toBe(1);
      expect(data.warning).toBeUndefined();
    });

    test("includes a warning when systolic >= 140", async () => {
      const response = await POST(
        postRequest({ systolic: 145, diastolic: 80 }),
        createCtx("1"),
      );
      const data = (await response.json()) as PostSuccess;

      expect(response.status).toBe(201);
      expect(data.warning).toContain("health coach");
    });

    test("returns 400 for invalid input", async () => {
      const response = await POST(
        postRequest({ systolic: 10, diastolic: 500 }),
        createCtx("1"),
      );
      const data = (await response.json()) as PostError;

      expect(response.status).toBe(400);
      expect(data.errors.systolic).toBeDefined();
      expect(data.errors.diastolic).toBeDefined();
    });

    test("rejects historical outliers", async () => {
      const baseReading: BloodPressureReading = {
        id: 1,
        userId: 1,
        createdAt: new Date(),
        systolic: 120,
        diastolic: 80,
      };
      db.bloodPressureReadings.reset({
        bloodPressureReadings: [
          { ...baseReading, id: 1 },
          { ...baseReading, id: 2 },
          { ...baseReading, id: 3 },
        ],
      });

      const response = await POST(
        postRequest({ systolic: 200, diastolic: 80 }),
        createCtx("1"),
      );
      const data = (await response.json()) as PostError;

      expect(response.status).toBe(400);
      expect(data.errors.systolic).toBeDefined();
    });
  });
});

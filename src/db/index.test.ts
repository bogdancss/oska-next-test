import { createDB } from "@/db";
import { sub } from "date-fns";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { DBShape } from "./dummy-data";
import type { BloodPressureReading } from "./types";

describe("db", () => {
  describe("createDB", () => {
    test("clones input data so original is not mutated", () => {
      const originalData: DBShape = {
        bloodPressureReadings: [
          {
            id: 1,
            userId: 1,
            createdAt: new Date(),
            systolic: 120,
            diastolic: 80,
          },
        ],
      };
      const db = createDB(originalData);

      db.bloodPressureReadings.create({
        userId: 1,
        systolic: 130,
        diastolic: 85,
      });

      expect(originalData.bloodPressureReadings).toHaveLength(1);
    });
  });

  describe("bloodPressureReadings.list", () => {
    test("returns readings for only the specified userId", () => {
      const user1Reading: BloodPressureReading = {
        id: 1,
        userId: 1,
        createdAt: new Date(),
        systolic: 120,
        diastolic: 80,
      };
      const user2Reading: BloodPressureReading = {
        id: 2,
        userId: 2,
        createdAt: new Date(),
        systolic: 130,
        diastolic: 85,
      };
      const mockDBData: DBShape = {
        bloodPressureReadings: [user1Reading, user2Reading],
      };
      const db = createDB(mockDBData);

      const readings = db.bloodPressureReadings.list({ userId: 1 });

      expect(readings).toEqual([user1Reading]);
    });

    test("returns empty array when no readings exist for userId", () => {
      const mockDBData: DBShape = {
        bloodPressureReadings: [
          {
            id: 1,
            userId: 1,
            createdAt: new Date(),
            systolic: 120,
            diastolic: 80,
          },
        ],
      };
      const db = createDB(mockDBData);

      const readings = db.bloodPressureReadings.list({ userId: 999 });

      expect(readings).toEqual([]);
    });

    test("filters correctly with multiple users", () => {
      const user1Reading1: BloodPressureReading = {
        id: 1,
        userId: 1,
        createdAt: sub(new Date(), { days: 2 }),
        systolic: 120,
        diastolic: 80,
      };
      const user1Reading2: BloodPressureReading = {
        id: 3,
        userId: 1,
        createdAt: sub(new Date(), { days: 1 }),
        systolic: 125,
        diastolic: 82,
      };
      const user2Reading: BloodPressureReading = {
        id: 2,
        userId: 2,
        createdAt: new Date(),
        systolic: 130,
        diastolic: 85,
      };

      const mockDBData: DBShape = {
        bloodPressureReadings: [user1Reading2, user1Reading1, user2Reading],
      };
      const db = createDB(mockDBData);

      const user1Readings = db.bloodPressureReadings.list({ userId: 1 });
      const user2Readings = db.bloodPressureReadings.list({ userId: 2 });

      expect(user1Readings).toEqual([user1Reading2, user1Reading1]);
      expect(user2Readings).toEqual([user2Reading]);
    });
  });

  describe("bloodPressureReadings.create", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test("creates reading with auto-incremented id", () => {
      const mockDBData: DBShape = {
        bloodPressureReadings: [
          {
            id: 1,
            userId: 1,
            createdAt: new Date(),
            systolic: 120,
            diastolic: 80,
          },
          {
            id: 5,
            userId: 1,
            createdAt: new Date(),
            systolic: 120,
            diastolic: 80,
          },
        ],
      };
      const db = createDB(mockDBData);

      const created = db.bloodPressureReadings.create({
        userId: 1,
        systolic: 130,
        diastolic: 85,
      });

      expect(created.id).toBe(6);
    });

    test("adds createdAt timestamp", () => {
      const fakeNow = new Date("2026-01-01T10:00:00.000Z");
      vi.setSystemTime(fakeNow);

      const mockDBData: DBShape = {
        bloodPressureReadings: [],
      };
      const db = createDB(mockDBData);

      const created = db.bloodPressureReadings.create({
        userId: 1,
        systolic: 130,
        diastolic: 85,
      });

      expect(created.createdAt).toEqual(fakeNow);
    });

    test("created reading is retrievable via list", () => {
      const mockDBData: DBShape = {
        bloodPressureReadings: [],
      };
      const db = createDB(mockDBData);

      db.bloodPressureReadings.create({
        userId: 1,
        systolic: 130,
        diastolic: 85,
      });

      const readings = db.bloodPressureReadings.list({ userId: 1 });
      expect(readings).toHaveLength(1);
      expect(readings[0]?.systolic).toBe(130);
      expect(readings[0]?.diastolic).toBe(85);
    });

    test("multiple creates have sequential ids", () => {
      const mockDBData: DBShape = {
        bloodPressureReadings: [
          {
            id: 10,
            userId: 1,
            createdAt: new Date(),
            systolic: 120,
            diastolic: 80,
          },
        ],
      };
      const db = createDB(mockDBData);

      const first = db.bloodPressureReadings.create({
        userId: 1,
        systolic: 130,
        diastolic: 85,
      });
      const second = db.bloodPressureReadings.create({
        userId: 1,
        systolic: 140,
        diastolic: 90,
      });
      const third = db.bloodPressureReadings.create({
        userId: 2,
        systolic: 150,
        diastolic: 95,
      });

      expect(first.id).toBe(11);
      expect(second.id).toBe(12);
      expect(third.id).toBe(13);
    });

    test("works with empty initial database", () => {
      const mockDBData: DBShape = {
        bloodPressureReadings: [],
      };
      const db = createDB(mockDBData);

      const created = db.bloodPressureReadings.create({
        userId: 1,
        systolic: 130,
        diastolic: 85,
      });

      expect(created.id).toBe(1);
    });
  });

  describe("bloodPressureReadings.reset", () => {
    test("resets database to new state", () => {
      const initialData: DBShape = {
        bloodPressureReadings: [
          {
            id: 1,
            userId: 1,
            createdAt: new Date(),
            systolic: 120,
            diastolic: 80,
          },
        ],
      };
      const db = createDB(initialData);

      const newData: DBShape = {
        bloodPressureReadings: [
          {
            id: 100,
            userId: 5,
            createdAt: new Date(),
            systolic: 140,
            diastolic: 90,
          },
        ],
      };
      db.bloodPressureReadings.reset(newData);

      const user1Readings = db.bloodPressureReadings.list({ userId: 1 });
      const user5Readings = db.bloodPressureReadings.list({ userId: 5 });

      expect(user1Readings).toHaveLength(0);
      expect(user5Readings).toHaveLength(1);
      expect(user5Readings[0]?.id).toBe(100);
    });

    test("clones the reset data so original is not mutated", () => {
      const initialData: DBShape = {
        bloodPressureReadings: [],
      };
      const db = createDB(initialData);

      const resetData: DBShape = {
        bloodPressureReadings: [
          {
            id: 1,
            userId: 1,
            createdAt: new Date(),
            systolic: 120,
            diastolic: 80,
          },
        ],
      };
      db.bloodPressureReadings.reset(resetData);

      db.bloodPressureReadings.create({
        userId: 1,
        systolic: 130,
        diastolic: 85,
      });

      expect(resetData.bloodPressureReadings).toHaveLength(1);
    });

    test("updates id counter based on new data", () => {
      const initialData: DBShape = {
        bloodPressureReadings: [
          {
            id: 100,
            userId: 1,
            createdAt: new Date(),
            systolic: 120,
            diastolic: 80,
          },
        ],
      };
      const db = createDB(initialData);

      db.bloodPressureReadings.reset({
        bloodPressureReadings: [
          {
            id: 5,
            userId: 1,
            createdAt: new Date(),
            systolic: 120,
            diastolic: 80,
          },
        ],
      });

      const created = db.bloodPressureReadings.create({
        userId: 1,
        systolic: 130,
        diastolic: 85,
      });

      expect(created.id).toBe(6);
    });
  });
});

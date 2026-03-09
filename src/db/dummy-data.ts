import { sub } from "date-fns";
import type { BloodPressureReading } from "./types";

export interface DBShape {
  bloodPressureReadings: Array<BloodPressureReading>;
}

export const dummyDBData: DBShape = {
  bloodPressureReadings: [
    // User 1 - Patient showing improvement with natural day-to-day variation
    {
      id: 1,
      userId: 1,
      createdAt: sub(new Date(), { days: 10 }),
      systolic: 168,
      diastolic: 92,
    },
    {
      id: 2,
      userId: 1,
      createdAt: sub(new Date(), { days: 9 }),
      systolic: 155,
      diastolic: 85,
    },
    {
      id: 3,
      userId: 1,
      createdAt: sub(new Date(), { days: 8 }),
      systolic: 162,
      diastolic: 88,
    },
    {
      id: 4,
      userId: 1,
      createdAt: sub(new Date(), { days: 7 }),
      systolic: 148,
      diastolic: 82,
    },
    {
      id: 5,
      userId: 1,
      createdAt: sub(new Date(), { days: 6 }),
      systolic: 152,
      diastolic: 84,
    },
    {
      id: 6,
      userId: 1,
      createdAt: sub(new Date(), { days: 5 }),
      systolic: 142,
      diastolic: 79,
    },
    {
      id: 7,
      userId: 1,
      createdAt: sub(new Date(), { days: 4 }),
      systolic: 138,
      diastolic: 81,
    },
    {
      id: 8,
      userId: 1,
      createdAt: sub(new Date(), { days: 3 }),
      systolic: 145,
      diastolic: 78,
    },
    {
      id: 9,
      userId: 1,
      createdAt: sub(new Date(), { days: 2 }),
      systolic: 136,
      diastolic: 76,
    },
    {
      id: 10,
      userId: 1,
      createdAt: sub(new Date(), { days: 1 }),
      systolic: 140,
      diastolic: 77,
    },

    // User 2 - Single reading for edge case testing
    {
      id: 11,
      userId: 2,
      createdAt: sub(new Date(), { days: 1 }),
      systolic: 145,
      diastolic: 82,
    },
  ],
};

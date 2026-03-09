import { dummyDBData, type DBShape } from "./dummy-data";
import type { BloodPressureReading, Unpersisted } from "./types";

function getMaxId(data: { id: number }[]) {
  return Math.max(...data.map(({ id }) => id), 0);
}

export function createDB(dataArg: DBShape) {
  let data = structuredClone(dataArg);
  let bloodPressureReadingMaxId = getMaxId(data.bloodPressureReadings);

  return {
    bloodPressureReadings: {
      list: ({ userId }: { userId: number }) =>
        data.bloodPressureReadings
          .filter((reading) => reading.userId === userId)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      create: (reading: Unpersisted<BloodPressureReading>) => {
        const bloodPressureReading: BloodPressureReading = {
          ...reading,
          id: ++bloodPressureReadingMaxId,
          createdAt: new Date(),
        };
        data.bloodPressureReadings.push(bloodPressureReading);
        return bloodPressureReading;
      },
      reset: (dbDataArg: DBShape) => {
        data = structuredClone(dbDataArg);
        bloodPressureReadingMaxId = getMaxId(data.bloodPressureReadings);
      },
    },
  };
}

export const db = createDB(dummyDBData);

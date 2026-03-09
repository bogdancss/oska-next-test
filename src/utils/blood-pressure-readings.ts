import type { BloodPressureReading } from "../db/types";

export function serializeBloodPressureReading(reading: BloodPressureReading) {
  return {
    ...reading,
    createdAt: reading.createdAt.toISOString(),
  };
}

export type SerializedBloodPressureReading = ReturnType<
  typeof serializeBloodPressureReading
>;

export function deserializeBloodPressureReading(
  reading: SerializedBloodPressureReading,
): BloodPressureReading {
  return {
    ...reading,
    createdAt: new Date(reading.createdAt),
  };
}

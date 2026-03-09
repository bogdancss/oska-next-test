"use client";

import { useEffect, useState } from "react";
import type { BloodPressureReading } from "../../../../db/types";
import {
  deserializeBloodPressureReading,
  type SerializedBloodPressureReading,
} from "../../../../utils/blood-pressure-readings";
import {
  BloodPressureReadingListCard,
  BloodPressureReadingListCardTitle,
  BloodPressureReadingsList,
} from "./_blood-pressure-reading-list";

// NOTE: This is not what we consider best practice!
// It's just a very rough first pass for communicating with the server via a
// REST API to give you a head start if it's useful. Feel very free to ignore
// this entirely and complete the tasks using your preferred library or
// technique.

const title = "REST";

export function BloodPressureReadingsRest({ userId }: { userId: number }) {
  const [bloodPressureReadings, setBloodPressureReadings] = useState<
    BloodPressureReading[]
  >([]);

  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/users/${userId}/blood-pressure-readings`)
      .then((res) => res.json())
      .then((data: { items: SerializedBloodPressureReading[] }) => {
        setBloodPressureReadings(
          data.items.map(deserializeBloodPressureReading),
        );
        setIsLoading(false);
      })
      .catch((error) => {
        setError(
          error instanceof Error ? error : new Error("Something went wrong"),
        );
        setIsLoading(false);
      });
  }, [userId]);

  if (isLoading) {
    return (
      <BloodPressureReadingListCard>
        <BloodPressureReadingListCardTitle>
          {title}
        </BloodPressureReadingListCardTitle>
        <p>Loading...</p>
      </BloodPressureReadingListCard>
    );
  }

  if (error) {
    return (
      <BloodPressureReadingListCard>
        <BloodPressureReadingListCardTitle>
          {title}
        </BloodPressureReadingListCardTitle>
        <p>Error: {error.message}</p>
      </BloodPressureReadingListCard>
    );
  }

  return (
    <BloodPressureReadingListCard>
      <BloodPressureReadingListCardTitle>
        {title}
      </BloodPressureReadingListCardTitle>
      <BloodPressureReadingsList readings={bloodPressureReadings} />
    </BloodPressureReadingListCard>
  );
}

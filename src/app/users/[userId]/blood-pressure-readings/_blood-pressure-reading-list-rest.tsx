"use client";

import { useCallback, useEffect, useState } from "react";
import type { BloodPressureReading } from "@/db/types";
import {
  deserializeBloodPressureReading,
  type SerializedBloodPressureReading,
} from "@/utils/blood-pressure-readings";
import {
  BloodPressureReadingListCard,
  BloodPressureReadingListCardTitle,
  BloodPressureReadingsList,
} from "./_blood-pressure-reading-list";

const title = "Readings";

interface Props {
  userId: number;
  refreshSignal?: number;
}

export function BloodPressureReadingsRest({ userId, refreshSignal }: Props) {
  const [bloodPressureReadings, setBloodPressureReadings] = useState<
    BloodPressureReading[]
  >([]);

  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReadings = useCallback(() => {
    fetch(`/api/users/${userId}/blood-pressure-readings`)
      .then((res) => res.json())
      .then((data: { items: SerializedBloodPressureReading[] }) => {
        setBloodPressureReadings(
          data.items.map(deserializeBloodPressureReading),
        );
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err : new Error("Something went wrong"),
        );
        setIsLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    fetchReadings();
  }, [fetchReadings, refreshSignal]);

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

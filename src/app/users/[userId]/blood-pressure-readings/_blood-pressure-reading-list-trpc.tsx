"use client";

import { api } from "../../../../trpc/react";
import {
  BloodPressureReadingListCard,
  BloodPressureReadingListCardTitle,
  BloodPressureReadingsList,
} from "./_blood-pressure-reading-list";

// NOTE: This is not what we consider best practice!
// It's just a very rough first pass for loading data with via tRPC to give you
// a head start if it's useful. Feel very free to ignore this entirely and
// complete the tasks using your preferred library or technique.

const title = "tRPC";

export function BloodPressureReadingsTrpc({ userId }: { userId: number }) {
  const bloodPressureReadingsQuery =
    api.users.bloodPressureReadings.list.useQuery({
      userId,
    });

  if (bloodPressureReadingsQuery.isPending) {
    return (
      <BloodPressureReadingListCard>
        <BloodPressureReadingListCardTitle>
          {title}
        </BloodPressureReadingListCardTitle>
        <p>Loading...</p>
      </BloodPressureReadingListCard>
    );
  }

  if (bloodPressureReadingsQuery.error) {
    return (
      <BloodPressureReadingListCard>
        <BloodPressureReadingListCardTitle>
          {title}
        </BloodPressureReadingListCardTitle>
        <p>Error: {bloodPressureReadingsQuery.error.message}</p>
      </BloodPressureReadingListCard>
    );
  }

  return (
    <BloodPressureReadingListCard>
      <BloodPressureReadingListCardTitle>
        {title}
      </BloodPressureReadingListCardTitle>
      <BloodPressureReadingsList
        readings={bloodPressureReadingsQuery.data.items}
      />
    </BloodPressureReadingListCard>
  );
}

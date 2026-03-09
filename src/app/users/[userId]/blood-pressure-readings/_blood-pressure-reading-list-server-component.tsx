import { db } from "@/db";
import {
  BloodPressureReadingListCard,
  BloodPressureReadingListCardTitle,
  BloodPressureReadingsList,
} from "./_blood-pressure-reading-list";

// NOTE: This is not what we consider best practice!
// It's just a very rough first pass for loading data via server components to
// give you a head start if it's useful. Feel very free to ignore this
// entirely and complete the tasks using your preferred library or technique.

const title = "Server Component";

export async function BloodPressureReadingsServerComponent({
  userId,
}: {
  userId: number;
}) {
  const readings = db.bloodPressureReadings.list({ userId });

  return (
    <BloodPressureReadingListCard>
      <BloodPressureReadingListCardTitle>
        {title}
      </BloodPressureReadingListCardTitle>
      <BloodPressureReadingsList readings={readings} />
    </BloodPressureReadingListCard>
  );
}

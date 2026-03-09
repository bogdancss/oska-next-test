"use client";

import { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { BloodPressureReadingForm } from "./_blood-pressure-reading-form";
import { BloodPressureReadingsRest } from "./_blood-pressure-reading-list-rest";

export default function BloodPressureReadings() {
  const { userId } = useParams<{ userId: string }>();
  const userIdNum = Number(userId);
  const [refreshSignal, setRefreshSignal] = useState(0);

  const handleSuccess = useCallback(() => {
    setRefreshSignal((s) => s + 1);
  }, []);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-medium">Blood Pressure Readings</h1>
      <div className="flex flex-row gap-4">
        <BloodPressureReadingForm userId={userIdNum} onSuccess={handleSuccess} />
        <BloodPressureReadingsRest userId={userIdNum} refreshSignal={refreshSignal} />
      </div>
    </div>
  );
}

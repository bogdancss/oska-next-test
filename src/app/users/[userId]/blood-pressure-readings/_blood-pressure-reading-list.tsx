import type { BloodPressureReading } from "@/db/types";

export function BloodPressureReadingListCardTitle({
  children,
}: React.PropsWithChildren) {
  return <h2 className="text-lg font-medium">{children}</h2>;
}

export function BloodPressureReadingListCard({
  children,
}: React.PropsWithChildren) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-gray-200 px-4 py-2">
      {children}
    </div>
  );
}

export function BloodPressureReadingsList({
  readings,
}: {
  readings: BloodPressureReading[];
}) {
  return (
    <ul>
      {readings.map((reading) => (
        <li key={reading.id} className="flex items-baseline gap-2">
          <span>
            {reading.systolic} / {reading.diastolic}
          </span>
          <span className="text-sm text-gray-500">
            {reading.createdAt.toLocaleDateString()}
          </span>
        </li>
      ))}
    </ul>
  );
}

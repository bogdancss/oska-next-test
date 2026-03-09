import z from "zod";
import { BloodPressureReadingsRest } from "./_blood-pressure-reading-list-rest";
import { BloodPressureReadingsServerComponent } from "./_blood-pressure-reading-list-server-component";
import { BloodPressureReadingsTrpc } from "./_blood-pressure-reading-list-trpc";

const paramsSchema = z.object({
  userId: z.coerce.number(),
});

export default async function BloodPressureReadings({
  params,
}: {
  params: Promise<unknown>;
}) {
  const parsedParams = paramsSchema.parse(await params);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-medium">Blood Pressure Readings</h1>
      <div className="flex flex-row gap-4">
        {/* 
          // TODO: Add your Blood Pressure Reading Form here
        */}

        {/*
          👇 Some very basic examples of how to communicate with the server.
          Feel very free to ignore, adjust, replace or delete.
        */}
        <BloodPressureReadingsServerComponent userId={parsedParams.userId} />
        <BloodPressureReadingsRest userId={parsedParams.userId} />
        <BloodPressureReadingsTrpc userId={parsedParams.userId} />
      </div>
    </div>
  );
}

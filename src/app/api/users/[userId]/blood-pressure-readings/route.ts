import { db } from "@/db";
import { serializeBloodPressureReading } from "@/utils/blood-pressure-readings";
import {
  bloodPressureReadingInputSchema,
  getBloodPressureWarning,
  validateAgainstHistory,
} from "@/utils/blood-pressure-validation";

type Ctx = RouteContext<"/api/users/[userId]/blood-pressure-readings">;

export async function GET(_request: Request, ctx: Ctx) {
  const params = await ctx.params;

  return Response.json({
    items: db.bloodPressureReadings
      .list({ userId: Number(params.userId) })
      .map(serializeBloodPressureReading),
  });
}

export async function POST(request: Request, ctx: Ctx) {
  const params = await ctx.params;
  const userId = Number(params.userId);

  const body: unknown = await request.json().catch(() => null);
  const parsed = bloodPressureReadingInputSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const recentReadings = db.bloodPressureReadings.list({ userId });
  const historyErrors = validateAgainstHistory(parsed.data, recentReadings);

  if (historyErrors.length > 0) {
    const errors: Record<string, string[]> = {};
    for (const err of historyErrors) {
      (errors[err.field] ??= []).push(err.message);
    }
    return Response.json({ errors }, { status: 400 });
  }

  const reading = db.bloodPressureReadings.create({
    userId,
    systolic: parsed.data.systolic,
    diastolic: parsed.data.diastolic,
  });

  const warning = getBloodPressureWarning(parsed.data.systolic);

  return Response.json(
    {
      reading: serializeBloodPressureReading(reading),
      ...(warning && { warning }),
    },
    { status: 201 },
  );
}

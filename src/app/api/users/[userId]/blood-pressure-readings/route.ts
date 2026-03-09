import { db } from "@/db";
import { serializeBloodPressureReading } from "@/utils/blood-pressure-readings";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/users/[userId]/blood-pressure-readings">,
) {
  const params = await ctx.params;

  return Response.json({
    items: db.bloodPressureReadings
      .list({ userId: Number(params.userId) })
      .map(serializeBloodPressureReading),
  });
}

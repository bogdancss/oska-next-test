import { createTRPCRouter } from "@/server/api/trpc";
import { bloodPressureReadingsRouter } from "./users/blood-pressure-readings/blood-pressure-readings-router";

export const usersRouter = createTRPCRouter({
  bloodPressureReadings: bloodPressureReadingsRouter,
});

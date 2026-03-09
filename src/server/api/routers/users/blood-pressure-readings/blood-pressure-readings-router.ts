import { db } from "@/db";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const bloodPressureReadingsRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ input }) => {
      const items = db.bloodPressureReadings.list({ userId: input.userId });
      return {
        items,
        count: items.length,
      };
    }),
});

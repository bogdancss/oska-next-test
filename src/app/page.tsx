import { HydrateClient } from "@/trpc/server";
import Link from "next/link";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex flex-col items-center justify-center gap-8">
        <Link
          href={{
            pathname: "/users/1/blood-pressure-readings",
          }}
          className="font-medium hover:underline"
        >
          User 1: Blood Pressure Readings
        </Link>
      </main>
    </HydrateClient>
  );
}

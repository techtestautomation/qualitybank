import { NextResponse } from "next/server";

import { resetDemoData } from "@/lib/test-data";

export async function POST() {
    if (
        process.env.NODE_ENV === "production" ||
        process.env.ENABLE_TEST_RESET !== "true"
        ) {
        return NextResponse.json(
            { error: "Not available" },
            { status: 404 },
        );
    }

  await resetDemoData();

  return NextResponse.json({
    status: "ok",
  });
}
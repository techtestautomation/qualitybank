import { NextResponse } from "next/server";

import { deleteCurrentSession } from "@/lib/auth";

export async function POST() {
  await deleteCurrentSession();

  return NextResponse.json(
    {
      status: "ok",
    },
    { status: 200 },
  );
}
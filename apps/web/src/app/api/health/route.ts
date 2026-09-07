import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: "ok",
        service: "qualitybank-web",
        database: "connected",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Health check failed", error);

    return NextResponse.json(
      {
        status: "error",
        service: "qualitybank-web",
        database: "disconnected",
      },
      { status: 503 },
    );
  }
}
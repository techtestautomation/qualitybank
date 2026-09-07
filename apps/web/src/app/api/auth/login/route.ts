import { NextResponse } from "next/server";

import {
  createSession,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();

  const email =
    typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";

  const password =
    typeof body.password === "string"
      ? body.password
      : "";

  if (!email || !password) {
    return NextResponse.json(
      {
        error: "Email and password are required",
      },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || user.status !== "ACTIVE") {
    return NextResponse.json(
      {
        error: "Invalid email or password",
      },
      { status: 401 },
    );
  }

  const passwordMatches = await verifyPassword(
    password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    return NextResponse.json(
      {
        error: "Invalid email or password",
      },
      { status: 401 },
    );
  }

  await createSession(user.id);

  return NextResponse.json(
    {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    },
    { status: 200 },
  );
}
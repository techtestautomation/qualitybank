import { NextResponse } from "next/server";

import { EmploymentStatus } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth";
import {
  evaluateLoan,
  parseMoneyToMinorUnits,
} from "@/lib/loans";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 },
    );
  }

  const body = await request.json();

  const amount =
    typeof body.amount === "string"
      ? body.amount
      : "";

  const annualIncome =
    typeof body.annualIncome === "string"
      ? body.annualIncome
      : "";

  const termMonths =
    typeof body.termMonths === "number"
      ? body.termMonths
      : Number(body.termMonths);

  const employmentStatus =
    typeof body.employmentStatus === "string"
      ? body.employmentStatus
      : "";

  const validEmploymentStatuses = Object.values(EmploymentStatus);

  if (
    !amount ||
    !annualIncome ||
    !Number.isInteger(termMonths) ||
    !validEmploymentStatuses.includes(
      employmentStatus as EmploymentStatus,
    )
  ) {
    return NextResponse.json(
      { error: "Complete all required loan details" },
      { status: 400 },
    );
  }

  try {
    const amountMinor = parseMoneyToMinorUnits(amount);
    const annualIncomeMinor =
      parseMoneyToMinorUnits(annualIncome);

    const decision = evaluateLoan({
      amountMinor,
      annualIncomeMinor,
      termMonths,
      employmentStatus:
        employmentStatus as EmploymentStatus,
    });

    const application =
      await prisma.loanApplication.create({
        data: {
          userId: currentUser.id,
          amountMinor,
          annualIncomeMinor,
          termMonths,
          employmentStatus:
            employmentStatus as EmploymentStatus,
          status: decision.status,
          interestRateBps: decision.interestRateBps,
        },
      });

    return NextResponse.json(
      {
        application: {
          id: application.id,
          status: application.status,
          interestRateBps:
            application.interestRateBps,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const code =
      error instanceof Error ? error.message : "";

    if (
      code === "LOAN_AMOUNT_INVALID" ||
      code === "LOAN_TERM_INVALID"
    ) {
      return NextResponse.json(
        { error: "Enter valid loan details" },
        { status: 400 },
      );
    }

    console.error("Loan application failed", error);

    return NextResponse.json(
      { error: "Unable to submit loan application" },
      { status: 500 },
    );
  }
}
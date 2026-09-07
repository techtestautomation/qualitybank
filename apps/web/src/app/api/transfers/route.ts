import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import {
  createTransfer,
  parseAmountToMinorUnits,
} from "@/lib/transfers";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 },
    );
  }

  const body = await request.json();

  const fromAccountId =
    typeof body.fromAccountId === "string"
      ? body.fromAccountId
      : "";

  const beneficiaryId =
    typeof body.beneficiaryId === "string"
      ? body.beneficiaryId
      : "";

  const amount =
    typeof body.amount === "string"
      ? body.amount
      : "";

  const reference =
    typeof body.reference === "string"
      ? body.reference
      : undefined;

  if (!fromAccountId || !beneficiaryId || !amount) {
    return NextResponse.json(
      { error: "Account, beneficiary and amount are required" },
      { status: 400 },
    );
  }

  try {
    const amountMinor = parseAmountToMinorUnits(amount);

    const transfer = await createTransfer({
      userId: currentUser.id,
      fromAccountId,
      beneficiaryId,
      amountMinor,
      reference,
    });

    return NextResponse.json(
      {
        transfer: {
          id: transfer.id,
          transferNumber: transfer.transferNumber,
          status: transfer.status,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const code =
      error instanceof Error ? error.message : "";

    if (code === "INSUFFICIENT_FUNDS") {
      return NextResponse.json(
        { error: "Insufficient funds" },
        { status: 400 },
      );
    }

    if (
      code === "ACCOUNT_NOT_FOUND" ||
      code === "BENEFICIARY_NOT_FOUND"
    ) {
      return NextResponse.json(
        { error: "Transfer details are invalid" },
        { status: 400 },
      );
    }

    if (code === "TRANSFER_AMOUNT_INVALID") {
      return NextResponse.json(
        { error: "Enter a valid transfer amount" },
        { status: 400 },
      );
    }

    console.error("Transfer failed", error);

    return NextResponse.json(
      { error: "Unable to complete transfer" },
      { status: 500 },
    );
  }
}
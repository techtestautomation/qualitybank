import crypto from "node:crypto";

import { prisma } from "@/lib/prisma";

type CreateTransferInput = {
  userId: string;
  fromAccountId: string;
  beneficiaryId: string;
  amountMinor: bigint;
  reference?: string;
};

export function parseAmountToMinorUnits(value: string) {
  const normalized = value.trim();

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    throw new Error("TRANSFER_AMOUNT_INVALID");
  }

  const [whole, fraction = ""] = normalized.split(".");
  const minor = fraction.padEnd(2, "0");

  return BigInt(whole) * 100n + BigInt(minor);
}

export async function createTransfer({
  userId,
  fromAccountId,
  beneficiaryId,
  amountMinor,
  reference,
}: CreateTransferInput) {
  if (amountMinor <= 0n) {
    throw new Error("TRANSFER_AMOUNT_INVALID");
  }

  return prisma.$transaction(async (tx) => {
    const account = await tx.account.findFirst({
      where: {
        id: fromAccountId,
        userId,
        status: "ACTIVE",
      },
    });

    if (!account) {
      throw new Error("ACCOUNT_NOT_FOUND");
    }

    const beneficiary = await tx.beneficiary.findFirst({
      where: {
        id: beneficiaryId,
        userId,
      },
    });

    if (!beneficiary) {
      throw new Error("BENEFICIARY_NOT_FOUND");
    }

    if (account.balanceMinor < amountMinor) {
      throw new Error("INSUFFICIENT_FUNDS");
    }

    const transferNumber =
      `TRF-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    const transfer = await tx.transfer.create({
      data: {
        transferNumber,
        fromAccountId: account.id,
        beneficiaryId: beneficiary.id,
        amountMinor,
        reference: reference?.trim() || null,
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    await tx.account.update({
      where: {
        id: account.id,
      },
      data: {
        balanceMinor: {
          decrement: amountMinor,
        },
      },
    });

    await tx.transaction.create({
      data: {
        accountId: account.id,
        type: "TRANSFER_OUT",
        amountMinor,
        description: `Transfer to ${beneficiary.name}`,
        reference: transfer.transferNumber,
      },
    });

    return transfer;
  });
}
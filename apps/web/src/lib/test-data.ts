import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

const DEMO_PASSWORD = "QualityBank123!";

export async function resetDemoData() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  await prisma.$transaction(async (tx) => {
    await tx.session.deleteMany();
    await tx.transfer.deleteMany();
    await tx.transaction.deleteMany();
    await tx.loanApplication.deleteMany();
    await tx.beneficiary.deleteMany();
    await tx.account.deleteMany();
    await tx.user.deleteMany();

    const customer = await tx.user.create({
      data: {
        email: "qa.customer@qualitybank.test",
        passwordHash,
        firstName: "Quality",
        lastName: "Customer",
        status: "ACTIVE",
      },
    });

    const receiver = await tx.user.create({
      data: {
        email: "test.receiver@qualitybank.test",
        passwordHash,
        firstName: "Test",
        lastName: "Receiver",
        status: "ACTIVE",
      },
    });

    const checking = await tx.account.create({
      data: {
        userId: customer.id,
        accountNumber: "QB100001",
        type: "CHECKING",
        balanceMinor: 12_545_000n,
        currency: "NOK",
        status: "ACTIVE",
      },
    });

    await tx.account.create({
      data: {
        userId: customer.id,
        accountNumber: "QB200001",
        type: "SAVINGS",
        balanceMinor: 4_820_000n,
        currency: "NOK",
        status: "ACTIVE",
      },
    });

    await tx.account.create({
      data: {
        userId: receiver.id,
        accountNumber: "QB100002",
        type: "CHECKING",
        balanceMinor: 2_500_000n,
        currency: "NOK",
        status: "ACTIVE",
      },
    });

    await tx.transaction.createMany({
      data: [
        {
          accountId: checking.id,
          type: "CREDIT",
          amountMinor: 350_000n,
          description: "Salary payment",
          reference: "SALARY-001",
        },
        {
          accountId: checking.id,
          type: "DEBIT",
          amountMinor: 8_990n,
          description: "Grocery purchase",
          reference: "GROCERY-001",
        },
        {
          accountId: checking.id,
          type: "DEBIT",
          amountMinor: 24_900n,
          description: "Electricity bill",
          reference: "UTILITY-001",
        },
      ],
    });

    await tx.beneficiary.create({
      data: {
        userId: customer.id,
        name: "Test Receiver",
        accountNumber: "QB100002",
        bankName: "QualityBank",
      },
    });

    await tx.loanApplication.create({
      data: {
        userId: customer.id,
        amountMinor: 25_000_000n,
        termMonths: 60,
        annualIncomeMinor: 75_000_000n,
        employmentStatus: "EMPLOYED",
        interestRateBps: 525,
        status: "APPROVED",
      },
    });
  });
}
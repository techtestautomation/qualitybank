import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.transfer.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.beneficiary.deleteMany();
  await prisma.loanApplication.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const demoPasswordHash = await bcrypt.hash("QualityBank123!", 12);

  const customerA = await prisma.user.create({
    data: {
      email: "qa.customer@qualitybank.test",
      passwordHash: demoPasswordHash,
      firstName: "Quality",
      lastName: "Customer",
      status: "ACTIVE",
      accounts: {
        create: [
          {
            accountNumber: "QB100001",
            type: "CHECKING",
            balanceMinor: 12_545_000n,
            currency: "NOK",
          },
          {
            accountNumber: "QB200001",
            type: "SAVINGS",
            balanceMinor: 4_820_000n,
            currency: "NOK",
          },
        ],
      },
    },
    include: {
      accounts: true,
    },
  });

  const customerB = await prisma.user.create({
    data: {
      email: "test.receiver@qualitybank.test",
      passwordHash: demoPasswordHash,
      firstName: "Test",
      lastName: "Receiver",
      status: "ACTIVE",
      accounts: {
        create: {
          accountNumber: "QB100002",
          type: "CHECKING",
          balanceMinor: 2_500_000n,
          currency: "NOK",
        },
      },
    },
    include: {
      accounts: true,
    },
  });

  const checkingAccount = customerA.accounts.find(
    (account) => account.accountNumber === "QB100001",
  );

  if (!checkingAccount) {
    throw new Error("Seed checking account not found");
  }

  await prisma.transaction.createMany({
    data: [
      {
        accountId: checkingAccount.id,
        type: "CREDIT",
        amountMinor: 350_000n,
        description: "Salary payment",
        reference: "SALARY-001",
      },
      {
        accountId: checkingAccount.id,
        type: "DEBIT",
        amountMinor: 8_990n,
        description: "Grocery purchase",
        reference: "GROCERY-001",
      },
      {
        accountId: checkingAccount.id,
        type: "DEBIT",
        amountMinor: 24_900n,
        description: "Electricity bill",
        reference: "UTILITY-001",
      },
    ],
  });

  await prisma.beneficiary.create({
    data: {
      userId: customerA.id,
      name: "Test Receiver",
      accountNumber: "QB100002",
      bankName: "QualityBank",
    },
  });

  await prisma.loanApplication.create({
    data: {
      userId: customerA.id,
      amountMinor: 25_000_000n,
      termMonths: 60,
      annualIncomeMinor: 75_000_000n,
      employmentStatus: "EMPLOYED",
      interestRateBps: 525,
      status: "APPROVED",
    },
  });

  console.log("QualityBank seed completed");
  console.log({
    customerA: customerA.email,
    customerB: customerB.email,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
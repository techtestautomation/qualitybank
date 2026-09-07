import { EmploymentStatus, LoanStatus } from "@/generated/prisma/client";

type EvaluateLoanInput = {
  amountMinor: bigint;
  termMonths: number;
  annualIncomeMinor: bigint;
  employmentStatus: EmploymentStatus;
};

export type LoanDecision = {
  status: LoanStatus;
  interestRateBps: number | null;
};

export function parseMoneyToMinorUnits(value: string) {
  const normalized = value.trim();

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    throw new Error("LOAN_AMOUNT_INVALID");
  }

  const [whole, fraction = ""] = normalized.split(".");
  const minor = fraction.padEnd(2, "0");

  return BigInt(whole) * 100n + BigInt(minor);
}

export function evaluateLoan({
  amountMinor,
  termMonths,
  annualIncomeMinor,
  employmentStatus,
}: EvaluateLoanInput): LoanDecision {
  if (amountMinor <= 0n || annualIncomeMinor <= 0n) {
    throw new Error("LOAN_AMOUNT_INVALID");
  }

  if (![12, 24, 36, 48, 60].includes(termMonths)) {
    throw new Error("LOAN_TERM_INVALID");
  }

  if (
    employmentStatus === EmploymentStatus.UNEMPLOYED ||
    employmentStatus === EmploymentStatus.STUDENT
  ) {
    return {
      status: LoanStatus.REJECTED,
      interestRateBps: null,
    };
  }

  const maximumLoanMinor = (annualIncomeMinor * 40n) / 100n;

  if (amountMinor > maximumLoanMinor) {
    return {
      status: LoanStatus.REJECTED,
      interestRateBps: null,
    };
  }

  const incomeRatioPercent =
    Number((amountMinor * 100n) / annualIncomeMinor);

  let interestRateBps = 525;

  if (incomeRatioPercent <= 20) {
    interestRateBps = 475;
  } else if (incomeRatioPercent <= 30) {
    interestRateBps = 525;
  } else {
    interestRateBps = 595;
  }

  return {
    status: LoanStatus.APPROVED,
    interestRateBps,
  };
}
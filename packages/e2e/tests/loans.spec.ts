import { expect, test } from "../src/fixtures/test";
import { DashboardPage } from "../src/pages/dashboard.page";
import { LoanPage } from "../src/pages/loan.page";
import { LoanResultPage } from "../src/pages/loan-result.page";

test.describe("Loans", () => {
  test("employed customer can receive an approved loan decision", async ({
    authenticatedPage,
  }) => {
    const dashboard = new DashboardPage(authenticatedPage);
    const loan = new LoanPage(authenticatedPage);
    const result = new LoanResultPage(authenticatedPage);

    await dashboard.openLoanApplication();

    await loan.expectLoaded();

    await loan.apply({
      amount: "100000",
      annualIncome: "750000",
      termMonths: "36",
      employmentStatus: "EMPLOYED",
    });

    await result.expectLoaded();

    await expect(authenticatedPage).toHaveURL(
      /\/loans\/[^/?]+$/,
    );

    await expect(result.heading).toHaveText(
      "Loan application approved",
    );

    await expect(result.valueFor("Loan amount")).toHaveText(
      "100 000,00 kr",
    );

    await expect(result.valueFor("Term")).toHaveText(
      "36 months",
    );

    await expect(result.valueFor("Employment")).toHaveText(
      "EMPLOYED",
    );

    await expect(result.valueFor("Decision")).toHaveText(
      "APPROVED",
    );

    await expect(result.valueFor("Interest rate")).toHaveText(
      "4.75%",
    );
  });

  test("loan is rejected when requested amount exceeds income rule", async ({
    authenticatedPage,
  }) => {
    const dashboard = new DashboardPage(authenticatedPage);
    const loan = new LoanPage(authenticatedPage);
    const result = new LoanResultPage(authenticatedPage);

    await dashboard.openLoanApplication();

    await loan.apply({
      amount: "400000",
      annualIncome: "750000",
      termMonths: "36",
      employmentStatus: "EMPLOYED",
    });

    await result.expectLoaded();

    await expect(result.heading).toHaveText(
      "Loan application not approved",
    );

    await expect(result.valueFor("Loan amount")).toHaveText(
      "400 000,00 kr",
    );

    await expect(result.valueFor("Decision")).toHaveText(
      "REJECTED",
    );

    await expect(
      result.valueFor("Interest rate"),
    ).toHaveCount(0);
  });

  test("student customer receives a rejected loan decision", async ({
    authenticatedPage,
  }) => {
    const dashboard = new DashboardPage(authenticatedPage);
    const loan = new LoanPage(authenticatedPage);
    const result = new LoanResultPage(authenticatedPage);

    await dashboard.openLoanApplication();

    await loan.apply({
      amount: "100000",
      annualIncome: "750000",
      termMonths: "36",
      employmentStatus: "STUDENT",
    });

    await result.expectLoaded();

    await expect(result.heading).toHaveText(
      "Loan application not approved",
    );

    await expect(result.valueFor("Employment")).toHaveText(
      "STUDENT",
    );

    await expect(result.valueFor("Decision")).toHaveText(
      "REJECTED",
    );

    await expect(
      result.valueFor("Interest rate"),
    ).toHaveCount(0);
  });
});
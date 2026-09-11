import { type Locator, type Page } from "@playwright/test";

export class LoanPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly amountInput: Locator;
  readonly termSelect: Locator;
  readonly annualIncomeInput: Locator;
  readonly employmentStatusSelect: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole("heading", {
      name: "Apply for a personal loan",
      exact: true,
    });

    this.amountInput = page.getByLabel("Loan amount (NOK)", {
      exact: true,
    });

    this.termSelect = page.getByLabel("Loan term", {
      exact: true,
    });

    this.annualIncomeInput = page.getByLabel(
      "Annual income (NOK)",
      {
        exact: true,
      },
    );

    this.employmentStatusSelect = page.getByLabel(
      "Employment status",
      {
        exact: true,
      },
    );

    this.submitButton = page.getByRole("button", {
      name: "Check eligibility",
      exact: true,
    });
  }

  async expectLoaded() {
    await this.heading.waitFor();
  }

  async apply({
    amount,
    termMonths = "36",
    annualIncome,
    employmentStatus = "EMPLOYED",
  }: {
    amount: string;
    termMonths?: string;
    annualIncome: string;
    employmentStatus?: string;
  }) {
    await this.amountInput.fill(amount);
    await this.termSelect.selectOption(termMonths);
    await this.annualIncomeInput.fill(annualIncome);
    await this.employmentStatusSelect.selectOption(
      employmentStatus,
    );

    await this.submitButton.click();
  }
}
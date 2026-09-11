import { type Locator, type Page } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly totalBalance: Locator;
  readonly checkingAccountLink: Locator;
  readonly transferMoneyLink: Locator;
  readonly applyForLoanLink: Locator;
  readonly profileLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole("heading", {
      name: /welcome/i,
    });

    this.totalBalance = page.getByText("173 650,00 kr", {
        exact: true,
    });

    this.checkingAccountLink = page
        .locator('a[href^="/accounts/"]')
        .filter({
            hasText: "QB100001",
    });

    this.transferMoneyLink = page.getByRole("link", {
      name: /transfer money/i,
    });

    this.applyForLoanLink = page.getByRole("link", {
      name: /apply for.*loan/i,
    });

    this.profileLink = page.getByRole("link", {
      name: /profile/i,
    });
  }

  async expectLoaded() {
    await this.heading.waitFor();
  }

  async openCheckingAccount() {
    await this.checkingAccountLink.click();
  }

  async openTransfer() {
    await this.transferMoneyLink.click();
  }

  async openLoanApplication() {
    await this.applyForLoanLink.click();
  }
}
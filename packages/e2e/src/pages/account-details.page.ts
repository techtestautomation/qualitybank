import { type Locator, type Page } from "@playwright/test";

export class AccountDetailsPage {
  readonly page: Page;
  readonly accountNumber: Locator;
  readonly accountType: Locator;
  readonly accountStatus: Locator;
  readonly availableBalanceLabel: Locator;
  readonly transactionHistoryHeading: Locator;
  readonly transactionTable: Locator;
  readonly allFilter: Locator;
  readonly moneyInFilter: Locator;
  readonly moneyOutFilter: Locator;
  readonly backToDashboardLink: Locator;
  readonly availableBalance: Locator;

  constructor(page: Page) {
    this.page = page;

    this.accountNumber = page.getByRole("heading", {
      level: 1,
    });

    this.accountType = page.getByText(/account$/, {
      exact: false,
    }).first();

    this.accountStatus = page.getByText(/^Status:/);

    this.availableBalanceLabel = page.getByText(
      "Available balance",
      {
        exact: true,
      },
    );

    this.transactionHistoryHeading = page.getByRole("heading", {
      name: "Transaction history",
    });

    this.transactionTable = page.getByRole("table");

    const filters = page.getByRole("navigation", {
      name: "Transaction filters",
    });

    this.allFilter = filters.getByRole("link", {
      name: "All",
      exact: true,
    });

    this.moneyInFilter = filters.getByRole("link", {
      name: "Money in",
      exact: true,
    });

    this.moneyOutFilter = filters.getByRole("link", {
      name: "Money out",
      exact: true,
    });

    this.backToDashboardLink = page.getByRole("link", {
      name: "Back to dashboard",
      exact: true,
    });

    this.availableBalanceLabel = page.getByText(
        "Available balance",
        {
            exact: true,
        },
    );

    this.availableBalance = page.getByTestId(
        "available-balance",
    );

    
  }

  async expectLoaded() {
    await this.transactionHistoryHeading.waitFor();
  }

  transaction(description: string) {
    return this.transactionTable.getByRole("row").filter({
      hasText: description,
    });
  }

  async showAllTransactions() {
    await this.allFilter.click();
  }

  async showMoneyIn() {
    await this.moneyInFilter.click();
  }

  async showMoneyOut() {
    await this.moneyOutFilter.click();
  }
}
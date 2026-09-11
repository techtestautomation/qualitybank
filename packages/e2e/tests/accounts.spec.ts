import { expect, test } from "../src/fixtures/test";
import { AccountDetailsPage } from "../src/pages/account-details.page";
import { DashboardPage } from "../src/pages/dashboard.page";

test.describe("Accounts", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    const dashboard = new DashboardPage(authenticatedPage);

    await dashboard.openCheckingAccount();
  });

  test("customer can view checking account details", 
    { tag: "@smoke" },
    async ({
    authenticatedPage,
  }) => {
    const account = new AccountDetailsPage(authenticatedPage);

    await account.expectLoaded();

    await expect(authenticatedPage).toHaveURL(
      /\/accounts\/[^/?]+$/,
    );

    await expect(account.accountNumber).toHaveText("QB100001");

    await expect(account.accountStatus).toHaveText(
      "Status: active",
    );

    await expect(account.availableBalanceLabel).toBeVisible();

    await expect(account.transactionHistoryHeading).toBeVisible();

    await expect(account.transactionTable).toBeVisible();
  });

  test("customer can filter incoming transactions", 
    { tag: "@regression" },
    async ({
    authenticatedPage,
  }) => {
    const account = new AccountDetailsPage(authenticatedPage);

    await account.showMoneyIn();

    await expect(authenticatedPage).toHaveURL(/type=in$/);

    await expect(account.moneyInFilter).toHaveAttribute(
      "aria-current",
      "page",
    );

    await expect(
      account.transaction("Salary payment"),
    ).toBeVisible();

    await expect(
      account.transaction("Grocery purchase"),
    ).toHaveCount(0);

    await expect(
      account.transaction("Electricity bill"),
    ).toHaveCount(0);
  });

  test("customer can filter outgoing transactions", 
    { tag: "@regression" },
    async ({
    authenticatedPage,
  }) => {
    const account = new AccountDetailsPage(authenticatedPage);

    await account.showMoneyOut();

    await expect(authenticatedPage).toHaveURL(/type=out$/);

    await expect(account.moneyOutFilter).toHaveAttribute(
      "aria-current",
      "page",
    );

    await expect(
      account.transaction("Grocery purchase"),
    ).toBeVisible();

    await expect(
      account.transaction("Electricity bill"),
    ).toBeVisible();

    await expect(
      account.transaction("Salary payment"),
    ).toHaveCount(0);
  });

  test("customer can return to all transactions", 
    { tag: "@regression" },
    async ({
    authenticatedPage,
  }) => {
    const account = new AccountDetailsPage(authenticatedPage);

    await account.showMoneyOut();
    await account.showAllTransactions();

    await expect(authenticatedPage).not.toHaveURL(/type=/);

    await expect(account.allFilter).toHaveAttribute(
      "aria-current",
      "page",
    );

    await expect(
      account.transaction("Salary payment"),
    ).toBeVisible();

    await expect(
      account.transaction("Grocery purchase"),
    ).toBeVisible();

    await expect(
      account.transaction("Electricity bill"),
    ).toBeVisible();
  });
});
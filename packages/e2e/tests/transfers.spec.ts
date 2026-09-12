import { expect, test } from "../src/fixtures/test";
import { AccountDetailsPage } from "../src/pages/account-details.page";
import { DashboardPage } from "../src/pages/dashboard.page";
import { TransferPage } from "../src/pages/transfer.page";
import { TransferReceiptPage } from "../src/pages/transfer-receipt.page";

test.describe("Transfers", () => {
  test("customer can transfer money to a saved beneficiary", 
    { tag: "@smoke" },
    async ({
    authenticatedPage,
  }) => {
    const dashboard = new DashboardPage(authenticatedPage);
    const transfer = new TransferPage(authenticatedPage);
    const receipt = new TransferReceiptPage(authenticatedPage);
    const account = new AccountDetailsPage(authenticatedPage);

    await dashboard.openTransfer();

    await transfer.expectLoaded();

    await expect(authenticatedPage).toHaveURL(/\/transfers\/new$/);

    await expect(transfer.fromAccountSelect).toContainText(
      "QB100001",
    );

    await expect(transfer.beneficiarySelect).toContainText(
      "Test Receiver",
    );

    await transfer.transfer({
      amount: "5000",
      message: "Automation test transfer",
    });

    await receipt.expectLoaded();

    await expect(authenticatedPage).toHaveURL(
      /\/transfers\/[^/?]+$/,
    );

    await expect(receipt.valueFor("Amount")).toHaveText(
      "5 000,00 kr",
    );

    await expect(receipt.valueFor("Beneficiary")).toHaveText(
      "Test Receiver",
    );

    await expect(receipt.valueFor("From account")).toHaveText(
      "QB100001",
    );

    await expect(receipt.valueFor("Transfer number")).toHaveText(
      /^TRF-[A-Z0-9]+$/,
    );

    await expect(receipt.valueFor("Message")).toHaveText(
      "Automation test transfer",
    );

    await receipt.openAccount();

    await account.expectLoaded();

    await expect(account.availableBalance).toHaveText(
        "120 450,00 kr",
    );

    await expect(account.accountNumber).toHaveText("QB100001");

    const transferTransaction = account.transaction(
        "Transfer to Test Receiver",
    );

    await expect(transferTransaction).toContainText(
        "transfer out",
    );

    await expect(transferTransaction).toContainText(
        "-5 000,00 kr",
    );
  });

  test("customer cannot transfer more than the available balance", 
    { tag: "@regression" },
    async ({
    authenticatedPage,
    }) => {
    const dashboard = new DashboardPage(authenticatedPage);
    const transfer = new TransferPage(authenticatedPage);
    const account = new AccountDetailsPage(authenticatedPage);

    await dashboard.openTransfer();

    await transfer.transfer({
        amount: "200000",
        message: "Insufficient funds test",
    });

    await expect(
        transfer.errorMessage("Insufficient funds"),
    ).toBeVisible();

    await expect(authenticatedPage).toHaveURL(
        /\/transfers\/new$/,
    );

    await authenticatedPage.goto("/dashboard");

    await dashboard.openCheckingAccount();

    await account.expectLoaded();

    await expect(account.availableBalance).toHaveText(
        "125 450,00 kr",
    );

    await expect(
        account.transaction("Transfer to Test Receiver"),
    ).toHaveCount(0);
  });

  test("customer cannot transfer an invalid amount", 
    { tag: "@regression" },
    async ({
    authenticatedPage,
    }) => {
    const dashboard = new DashboardPage(authenticatedPage);
    const transfer = new TransferPage(authenticatedPage);

    await dashboard.openTransfer();

    await transfer.transfer({
        amount: "0",
        message: "Invalid amount test",
    });

    await expect(
        transfer.errorMessage("Enter a valid transfer amount"),
    ).toBeVisible();

    await expect(authenticatedPage).toHaveURL(
        /\/transfers\/new$/,
    );
  });
});
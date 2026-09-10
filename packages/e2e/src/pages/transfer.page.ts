import { type Locator, type Page } from "@playwright/test";

export class TransferPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly fromAccountSelect: Locator;
  readonly beneficiarySelect: Locator;
  readonly amountInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole("heading", {
      name: "Transfer money",
      exact: true,
    });

    this.fromAccountSelect = page.getByLabel("From account", {
      exact: true,
    });

    this.beneficiarySelect = page.getByLabel("Beneficiary", {
      exact: true,
    });

    this.amountInput = page.getByLabel("Amount (NOK)", {
      exact: true,
    });

    this.messageInput = page.getByLabel("Message", {
      exact: true,
    });

    this.submitButton = page.getByRole("button", {
      name: "Transfer money",
      exact: true,
    });
  }

  async expectLoaded() {
    await this.heading.waitFor();
  }

  async transfer({
    amount,
    message,
  }: {
    amount: string;
    message?: string;
  }) {
    await this.amountInput.fill(amount);

    if (message !== undefined) {
      await this.messageInput.fill(message);
    }

    await this.submitButton.click();
  }

  errorMessage(message: string) {
    return this.page.getByText(message, {
      exact: true,
    });
  }
}
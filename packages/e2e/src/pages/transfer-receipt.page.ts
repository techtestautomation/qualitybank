import { type Locator, type Page } from "@playwright/test";

export class TransferReceiptPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly viewAccountLink: Locator;
  readonly dashboardLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole("heading", {
      name: "Transfer completed",
      exact: true,
    });

    this.viewAccountLink = page.getByRole("link", {
      name: "View account",
      exact: true,
    });

    this.dashboardLink = page.getByRole("link", {
      name: "Dashboard",
      exact: true,
    });
  }

  async expectLoaded() {
    await this.heading.waitFor();
  }

  valueFor(label: string) {
    return this.page
      .locator("dl > div")
      .filter({
        has: this.page.locator("dt", {
          hasText: label,
        }),
      })
      .locator("dd");
  }

  async openAccount() {
    await this.viewAccountLink.click();
  }
}
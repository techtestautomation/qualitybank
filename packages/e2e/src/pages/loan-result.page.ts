import { type Locator, type Page } from "@playwright/test";

export class LoanResultPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly newApplicationLink: Locator;
  readonly dashboardLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole("heading", {
      level: 1,
    });

    this.newApplicationLink = page.getByRole("link", {
      name: "New application",
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
}
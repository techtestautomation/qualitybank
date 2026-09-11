import { type Locator, type Page } from "@playwright/test";

export class ProfilePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly backToDashboardLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole("heading", {
      name: "Profile",
      exact: true,
    });

    this.backToDashboardLink = page.getByRole("link", {
      name: "Back to dashboard",
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
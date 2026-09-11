import { expect, test } from "../src/fixtures/test";
import { DashboardPage } from "../src/pages/dashboard.page";

test.describe("Dashboard", () => {
  test("authenticated customer can view account summary", 
    { tag: "@smoke" },
    async ({
    authenticatedPage,
  }) => {
    const dashboard = new DashboardPage(authenticatedPage);

    await dashboard.expectLoaded();

    await expect(authenticatedPage).toHaveURL(/\/dashboard$/);

    await expect(dashboard.heading).toBeVisible();

    await expect(dashboard.totalBalance).toBeVisible();

    await expect(dashboard.transferMoneyLink).toBeVisible();

    await expect(dashboard.applyForLoanLink).toBeVisible();

    await expect(dashboard.profileLink).toBeVisible();
  });
});
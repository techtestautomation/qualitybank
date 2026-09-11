import { expect, test } from "../src/fixtures/test";
import { DashboardPage } from "../src/pages/dashboard.page";

test.describe("Logout", () => {
  test("customer can sign out and can no longer access protected pages", async ({
    authenticatedPage,
  }) => {
    const dashboard = new DashboardPage(authenticatedPage);

    await dashboard.signOut();

    await expect(authenticatedPage).toHaveURL(/\/login$/);

    await authenticatedPage.goto("/dashboard");

    await expect(authenticatedPage).toHaveURL(/\/login$/);
  });
});
import { expect, test } from "../src/fixtures/test";
import { DashboardPage } from "../src/pages/dashboard.page";
import { ProfilePage } from "../src/pages/profile.page";
import { testUsers } from "../src/support/test-users";

test.describe("Profile", { tag: "@regression" }, () => {
  test("authenticated customer can view profile information", async ({
    authenticatedPage,
  }) => {
    const dashboard = new DashboardPage(authenticatedPage);
    const profile = new ProfilePage(authenticatedPage);

    await dashboard.openProfile();
    await profile.expectLoaded();

    await expect(authenticatedPage).toHaveURL(/\/profile$/);

    await expect(profile.valueFor("First name")).toHaveText(
      testUsers.customer.firstName,
    );

    await expect(profile.valueFor("Last name")).toHaveText(
      testUsers.customer.lastName,
    );

    await expect(profile.valueFor("Email")).toHaveText(
      testUsers.customer.email,
    );

    await expect(profile.valueFor("Customer status")).toHaveText(
      "ACTIVE",
    );
  });

  test("customer can return from profile to dashboard", async ({
    authenticatedPage,
  }) => {
    const dashboard = new DashboardPage(authenticatedPage);
    const profile = new ProfilePage(authenticatedPage);

    await dashboard.openProfile();
    await profile.expectLoaded();

    await profile.backToDashboardLink.click();

    await expect(authenticatedPage).toHaveURL(/\/dashboard$/);
    await expect(
      authenticatedPage.getByRole("heading", {
        name: /welcome back/i,
      }),
    ).toBeVisible();
  });
});
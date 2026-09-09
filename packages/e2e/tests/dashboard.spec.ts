import { expect, test } from "../src/fixtures/test";

test.describe("Dashboard", () => {
  test("authenticated customer can view dashboard", async ({
    authenticatedPage,
  }) => {
    await expect(authenticatedPage).toHaveURL(/\/dashboard$/);

    await expect(
      authenticatedPage.getByRole("heading", {
        name: /welcome/i,
      }),
    ).toBeVisible();
  });
});
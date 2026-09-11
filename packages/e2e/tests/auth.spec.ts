import { expect, test } from "../src/fixtures/test";
import { testUsers } from "../src/support/test-users";

test.describe("Authentication", () => {
  test("customer can sign in with valid credentials", 
    { tag: "@smoke" },
    async ({
    page,
    loginPage,
  }) => {
    await loginPage.goto();

    await loginPage.login(
      testUsers.customer.email,
      testUsers.customer.password,
    );

    await expect(page).toHaveURL(/\/dashboard$/);

    await expect(
      page.getByRole("heading", {
        name: /welcome/i,
      }),
    ).toBeVisible();
  });

  test("customer cannot sign in with invalid credentials", 
    { tag: "@regression" },
    async ({
    page,
    loginPage,
  }) => {
    await loginPage.goto();

    await loginPage.login(
      testUsers.customer.email,
      "WrongPassword123!",
    );

    await expect(
      loginPage.errorMessage("Invalid email or password"),
    ).toBeVisible();

    await expect(page).toHaveURL(/\/login$/);
  });

  test("unauthenticated customer cannot access dashboard", 
    { tag: "@regression" },
    async ({
    page,
  }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/login$/);
  });
});
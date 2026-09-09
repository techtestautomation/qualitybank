import {
  test as base,
  expect,
  type Page,
} from "@playwright/test";

import { authenticateCustomer } from "./authenticated-customer";
import { LoginPage } from "../pages/login.page";
import { resetTestData } from "../support/test-data";

type QualityBankFixtures = {
  loginPage: LoginPage;
  authenticatedPage: Page;
};

export const test = base.extend<QualityBankFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  authenticatedPage: async (
    { request, context, page },
    use,
  ) => {
    await authenticateCustomer({
      request,
      context,
      page,
    });

    await use(page);
  },
});

test.beforeEach(async ({ request }) => {
  await resetTestData(request);
});

export { expect };
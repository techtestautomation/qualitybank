import {
  test as base,
  expect,
  type Page,
} from "@playwright/test";

import { authenticateCustomer } from "./authenticated-customer";
import { LoginPage } from "../pages/login.page";
import { resetTestData } from "../support/test-data";

type QualityBankFixtures = {
  resetData: void;
  loginPage: LoginPage;
  authenticatedPage: Page;
};

export const test = base.extend<QualityBankFixtures>({
  resetData: [
    async ({ request }, use) => {
      await resetTestData(request);
      await use();
    },
    {
      auto: true,
    },
  ],

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

export { expect };
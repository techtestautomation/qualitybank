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
  diagnostics: void;
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

  diagnostics: [
    async ({ page }, use, testInfo) => {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];
      const failedRequests: Array<{
        method: string;
        url: string;
        error: string;
      }> = [];
      const errorResponses: Array<{
        method: string;
        url: string;
        status: number;
        statusText: string;
      }> = [];

      page.on("console", (message) => {
        if (message.type() === "error") {
          consoleErrors.push(message.text());
        }
      });

      page.on("pageerror", (error) => {
        pageErrors.push(error.message);
      });

      page.on("requestfailed", (request) => {
        failedRequests.push({
          method: request.method(),
          url: request.url(),
          error:
            request.failure()?.errorText ??
            "Unknown request failure",
        });
      });

      page.on("response", (response) => {
        if (response.status() >= 400) {
          errorResponses.push({
            method: response.request().method(),
            url: response.url(),
            status: response.status(),
            statusText: response.statusText(),
          });
        }
      });

      await use();

      if (testInfo.status !== testInfo.expectedStatus) {
        const diagnostics = {
          test: testInfo.title,
          status: testInfo.status,
          expectedStatus: testInfo.expectedStatus,
          url: page.url(),
          consoleErrors,
          pageErrors,
          failedRequests,
          errorResponses,
        };

        await testInfo.attach("qualitybank-diagnostics", {
          body: Buffer.from(
            JSON.stringify(diagnostics, null, 2),
          ),
          contentType: "application/json",
        });
      }
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
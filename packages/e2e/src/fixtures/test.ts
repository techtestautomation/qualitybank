import { writeFile } from "node:fs/promises";
import {
  test as base,
  expect,
  type Page,
} from "@playwright/test";
import { authenticateCustomer } from "./authenticated-customer";
import { LoginPage } from "../pages/login.page";
import {
  buildFailureContext,
  type ErrorResponse,
  type FailedRequest,
} from "../support/failure-context";
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
      const failedRequests: FailedRequest[] = [];
      const errorResponses: ErrorResponse[] = [];

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
        const failureContext = buildFailureContext({
          test: {
            title: testInfo.title,
            file: testInfo.file,
            project: testInfo.project.name,
            retry: testInfo.retry,
            status: testInfo.status ?? "unknown",
            expectedStatus: testInfo.expectedStatus,
          },

          pageUrl: page.url(),

          playwrightErrors: testInfo.errors.map((error) => ({
            message:
              error.message ??
              String(error.value ?? "Unknown Playwright error"),
            ...(error.stack
              ? {
                  stack: error.stack,
                }
              : {}),
          })),

          consoleErrors,
          pageErrors,
          failedRequests,
          errorResponses,
        });

        const diagnosticsPath = testInfo.outputPath(
          "qualitybank-diagnostics.json",
        );

        await writeFile(
          diagnosticsPath,
          JSON.stringify(failureContext, null, 2),
          "utf8",
        );

        await testInfo.attach("qualitybank-diagnostics", {
          path: diagnosticsPath,
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
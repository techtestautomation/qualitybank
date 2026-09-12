import { expect, test } from "@playwright/test";

import {
  buildFailureContext,
  type FailureContext,
} from "../src/support/failure-context";

test(
  "builds normalized failure context",
  { tag: "@regression" },
  () => {
    const context: FailureContext =
      buildFailureContext({
        test: {
          title:
            "customer can transfer money",
          file:
            "/tests/transfers.spec.ts",
          project: "chromium",
          retry: 1,
          status: "failed",
          expectedStatus: "passed",
        },

        pageUrl:
          "http://localhost:3000/transfers/new",

        observedPageState: {
          title: "QualityBank",
          visibleText:
            "QualityBank Dashboard Total balance 173 650,00 kr Transfer money",
        },

        playwrightErrors: [
          {
            message:
              "Error: expect(locator).toBeVisible() failed",
            stack:
              "Error: expect(locator).toBeVisible() failed\n    at /tests/transfers.spec.ts:42:12",
          },
        ],

        consoleErrors: [
          "Failed to load resource",
        ],

        pageErrors: [
          "Unexpected application error",
        ],

        failedRequests: [
          {
            method: "POST",
            url:
              "http://localhost:3000/api/transfers",
            error:
              "net::ERR_CONNECTION_RESET",
          },
        ],

        errorResponses: [
          {
            method: "POST",
            url:
              "http://localhost:3000/api/transfers",
            status: 500,
            statusText:
              "Internal Server Error",
          },
        ],
      });

    expect(context).toEqual({
      schemaVersion: 1,

      test: {
        title:
          "customer can transfer money",
        file:
          "/tests/transfers.spec.ts",
        project: "chromium",
        retry: 1,
        status: "failed",
        expectedStatus: "passed",
      },

      page: {
        url:
          "http://localhost:3000/transfers/new",

        observedState: {
          title: "QualityBank",
          visibleText:
            "QualityBank Dashboard Total balance 173 650,00 kr Transfer money",
        },
      },

      playwrightErrors: [
        {
          message:
            "Error: expect(locator).toBeVisible() failed",

          stack:
            "Error: expect(locator).toBeVisible() failed\n    at /tests/transfers.spec.ts:42:12",
        },
      ],

      browser: {
        consoleErrors: [
          "Failed to load resource",
        ],

        pageErrors: [
          "Unexpected application error",
        ],

        failedRequests: [
          {
            method: "POST",
            url:
              "http://localhost:3000/api/transfers",
            error:
              "net::ERR_CONNECTION_RESET",
          },
        ],

        errorResponses: [
          {
            method: "POST",
            url:
              "http://localhost:3000/api/transfers",
            status: 500,
            statusText:
              "Internal Server Error",
          },
        ],
      },
    });
  },
);
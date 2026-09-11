import { expect, test } from "@playwright/test";

import { buildFailureContext } from "../src/support/failure-context";

test(
  "builds normalized failure context",
  { tag: "@regression" },
  () => {
    const context = buildFailureContext({
      test: {
        title: "customer can transfer money",
        file: "/tests/transfers.spec.ts",
        project: "chromium",
        retry: 1,
        status: "failed",
        expectedStatus: "passed",
      },

      pageUrl: "http://localhost:3000/transfers/new",

      playwrightErrors: [
        {
          message:
            "expect(locator).toBeVisible() failed",
          stack: "Error: expect(locator).toBeVisible() failed",
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
          url: "http://localhost:3000/api/transfers",
          error: "net::ERR_CONNECTION_RESET",
        },
      ],

      errorResponses: [
        {
          method: "POST",
          url: "http://localhost:3000/api/transfers",
          status: 500,
          statusText: "Internal Server Error",
        },
      ],
    });

    expect(context).toEqual({
      schemaVersion: 1,

      test: {
        title: "customer can transfer money",
        file: "/tests/transfers.spec.ts",
        project: "chromium",
        retry: 1,
        status: "failed",
        expectedStatus: "passed",
      },

      page: {
        url: "http://localhost:3000/transfers/new",
      },

      playwrightErrors: [
        {
          message:
            "expect(locator).toBeVisible() failed",
          stack:
            "Error: expect(locator).toBeVisible() failed",
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
            url: "http://localhost:3000/api/transfers",
            error: "net::ERR_CONNECTION_RESET",
          },
        ],

        errorResponses: [
          {
            method: "POST",
            url: "http://localhost:3000/api/transfers",
            status: 500,
            statusText: "Internal Server Error",
          },
        ],
      },
    });
  },
);
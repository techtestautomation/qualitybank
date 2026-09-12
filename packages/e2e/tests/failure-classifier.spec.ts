import { expect, test } from "@playwright/test";

import {
  classifyFailure,
  type FailureCategory,
} from "../src/support/failure-classifier";
import type { FailureContext } from "../src/support/failure-context";

function createContext(
  overrides: Partial<FailureContext> = {},
): FailureContext {
  return {
    schemaVersion: 1,

    test: {
      title: "example failing test",
      file: "/tests/example.spec.ts",
      project: "chromium",
      retry: 0,
      status: "failed",
      expectedStatus: "passed",
    },

    page: {
      url: "http://localhost:3000/dashboard",
    },

    playwrightErrors: [],

    browser: {
      consoleErrors: [],
      pageErrors: [],
      failedRequests: [],
      errorResponses: [],
    },

    ...overrides,
  };
}

function expectCategory(
  context: FailureContext,
  expectedCategory: FailureCategory,
) {
  expect(classifyFailure(context).category).toBe(
    expectedCategory,
  );
}

test.describe("failure classifier", () => {
  test(
    "classifies failed network requests",
    { tag: "@regression" },
    () => {
      const context = createContext({
        browser: {
          consoleErrors: [],
          pageErrors: [],
          errorResponses: [],
          failedRequests: [
            {
              method: "POST",
              url: "http://localhost:3000/api/transfers",
              error: "net::ERR_CONNECTION_RESET",
            },
          ],
        },
      });

      const result = classifyFailure(context);

      expectCategory(context, "NETWORK_FAILURE");
      expect(result.confidence).toBe("high");
      expect(result.evidence).toContain(
        "net::ERR_CONNECTION_RESET",
      );
    },
  );

  test(
    "classifies server HTTP errors before assertion symptoms",
    { tag: "@regression" },
    () => {
      const context = createContext({
        playwrightErrors: [
          {
            message:
              "Error: expect(locator).toBeVisible() failed",
          },
        ],

        browser: {
          consoleErrors: [],
          pageErrors: [],
          failedRequests: [],
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

      const result = classifyFailure(context);

      expectCategory(context, "HTTP_ERROR");
      expect(result.confidence).toBe("high");
    },
  );

  test(
    "classifies browser page errors",
    { tag: "@regression" },
    () => {
      const context = createContext({
        browser: {
          consoleErrors: [],
          failedRequests: [],
          errorResponses: [],
          pageErrors: [
            "ReferenceError: customer is not defined",
          ],
        },
      });

      expectCategory(context, "PAGE_ERROR");
    },
  );

  test(
    "classifies Playwright assertion failures",
    { tag: "@regression" },
    () => {
      const context = createContext({
        playwrightErrors: [
          {
            message: [
              "Error: expect(locator).toBeVisible() failed",
              "",
              "Locator: getByText('173 651,00 kr')",
              "Expected: visible",
              "Error: element(s) not found",
            ].join("\n"),
          },
        ],
      });

      const result = classifyFailure(context);

      expectCategory(
        context,
        "ASSERTION_FAILURE",
      );

      expect(result.confidence).toBe("medium");
    },
  );

  test(
    "returns unknown when evidence is insufficient",
    { tag: "@regression" },
    () => {
      const result = classifyFailure(
        createContext(),
      );

      expect(result).toEqual({
        category: "UNKNOWN",
        confidence: "low",
        summary:
          "The captured evidence does not match a known deterministic failure category.",
        evidence: [],
      });
    },
  );

  test(
    "classifies the real dashboard balance failure",
    { tag: "@regression" },
    () => {
        const context = createContext({
        page: {
            url: "http://localhost:3000/dashboard",
        },

        playwrightErrors: [
            {
            message: [
                "Error: expect(locator).toBeVisible() failed",
                "",
                "Locator: getByText('173 651,00 kr', { exact: true })",
                "Expected: visible",
                "Timeout: 5000ms",
                "Error: element(s) not found",
            ].join("\n"),
            },
        ],
        });

        const result = classifyFailure(context);

        expect(result.category).toBe(
        "ASSERTION_FAILURE",
        );
        expect(result.confidence).toBe("medium");
        expect(result.summary).toBe(
        "A Playwright assertion did not match the observed application state.",
        );
    },
    );
});
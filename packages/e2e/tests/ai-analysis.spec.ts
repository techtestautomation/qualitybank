import { expect, test } from "@playwright/test";

import {
  buildAiAnalysisRequest,
} from "../src/analysis/ai-analysis";
import {
  buildAiAnalysisPrompt,
} from "../src/analysis/ai-prompt";
import type {
  FailureClassification,
} from "../src/support/failure-classifier";
import type {
  FailureContext,
} from "../src/support/failure-context";

test(
  "builds structured AI failure-analysis input",
  { tag: "@regression" },
  () => {
    const failureContext: FailureContext = {
      schemaVersion: 1,

      test: {
        title:
          "authenticated customer can view account summary",
        file: "/tests/dashboard.spec.ts",
        project: "chromium",
        retry: 0,
        status: "failed",
        expectedStatus: "passed",
      },

      page: {
        url: "http://localhost:3000/dashboard",
      },

      playwrightErrors: [
        {
          message: [
            "Error: expect(locator).toBeVisible() failed",
            "Locator: getByText('173 651,00 kr')",
            "Error: element(s) not found",
          ].join("\n"),
        },
      ],

      browser: {
        consoleErrors: [],
        pageErrors: [],
        failedRequests: [],
        errorResponses: [],
      },
    };

    const classification: FailureClassification = {
      category: "ASSERTION_FAILURE",
      confidence: "medium",
      summary:
        "A Playwright assertion did not match the observed application state.",
      evidence: [
        "Locator searched for 173 651,00 kr",
      ],
    };

    const request = buildAiAnalysisRequest(
      failureContext,
      classification,
    );

    expect(request.schemaVersion).toBe(1);
    expect(request.failureContext).toBe(
      failureContext,
    );
    expect(
      request.deterministicClassification,
    ).toBe(classification);

    const prompt = buildAiAnalysisPrompt(request);

    expect(prompt).toContain(
      "using only the supplied evidence",
    );

    expect(prompt).toContain(
      "ASSERTION_FAILURE",
    );

    expect(prompt).toContain(
      "173 651,00 kr",
    );

    expect(prompt).toContain(
      "Do not invent application behavior",
    );
  },
);
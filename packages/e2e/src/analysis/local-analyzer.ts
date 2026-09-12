import type { AiFailureAnalysis } from "./analysis-schema";
import type { AiAnalysisRequest } from "./ai-analysis";

export function analyzeFailureLocally(
  request: AiAnalysisRequest,
): AiFailureAnalysis {
  const {
    failureContext,
    deterministicClassification,
  } = request;

  const firstPlaywrightError =
    failureContext.playwrightErrors[0]?.message;

  const evidence = [
    ...deterministicClassification.evidence,
  ];

  if (
    firstPlaywrightError &&
    !evidence.includes(firstPlaywrightError)
  ) {
    evidence.push(firstPlaywrightError);
  }

  return {
    schemaVersion: 1,

    summary:
      deterministicClassification.summary,

    probableRootCause:
      buildProbableRootCause(request),

    confidence:
      deterministicClassification.confidence,

    evidence,

    recommendedActions:
      buildRecommendedActions(request),
  };
}

function buildProbableRootCause(
  request: AiAnalysisRequest,
): string {
  const category =
    request.deterministicClassification.category;

  switch (category) {
    case "NETWORK_FAILURE":
      return "A network request failed before the application received a valid response.";

    case "HTTP_ERROR":
      return "An application request returned an unsuccessful HTTP response.";

    case "PAGE_ERROR":
      return "The page raised an unhandled JavaScript error during the test.";

    case "ASSERTION_FAILURE":
      return "The observed application state did not match the Playwright assertion.";

    case "CONSOLE_ERROR":
      return "The browser emitted an application console error during the test.";

    case "UNKNOWN":
      return "The available evidence is insufficient to determine a probable root cause.";
  }
}

function buildRecommendedActions(
  request: AiAnalysisRequest,
): string[] {
  const category =
    request.deterministicClassification.category;

  switch (category) {
    case "NETWORK_FAILURE":
      return [
        "Inspect the failed request URL and network error.",
        "Verify that the target service was available during the test.",
      ];

    case "HTTP_ERROR":
      return [
        "Inspect the failing endpoint and HTTP status.",
        "Check server logs and test data for the affected request.",
      ];

    case "PAGE_ERROR":
      return [
        "Inspect the captured page error and browser trace.",
        "Reproduce the failing page state locally.",
      ];

    case "ASSERTION_FAILURE":
      return [
        "Compare the assertion expectation with the rendered application state.",
        "Verify whether test data or expected values changed.",
        "Inspect the screenshot and Playwright trace.",
      ];

    case "CONSOLE_ERROR":
      return [
        "Inspect the browser console error.",
        "Determine whether the console error is related to the failed assertion.",
      ];

    case "UNKNOWN":
      return [
        "Inspect the Playwright trace, screenshot, and diagnostic evidence manually.",
      ];
  }
}
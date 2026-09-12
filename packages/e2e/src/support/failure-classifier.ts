import type { FailureContext } from "./failure-context";

export type FailureCategory =
  | "NETWORK_FAILURE"
  | "HTTP_ERROR"
  | "PAGE_ERROR"
  | "ASSERTION_FAILURE"
  | "CONSOLE_ERROR"
  | "UNKNOWN";

export type FailureConfidence =
  | "high"
  | "medium"
  | "low";

export type FailureClassification = {
  category: FailureCategory;
  confidence: FailureConfidence;
  summary: string;
  evidence: string[];
};

export function classifyFailure(
  context: FailureContext,
): FailureClassification {
  const failedRequest = context.browser.failedRequests[0];

  if (failedRequest) {
    return {
      category: "NETWORK_FAILURE",
      confidence: "high",
      summary:
        `${failedRequest.method} request failed before receiving a valid response.`,
      evidence: [
        `${failedRequest.method} ${failedRequest.url}`,
        failedRequest.error,
      ],
    };
  }

  const serverError = context.browser.errorResponses.find(
    (response) => response.status >= 500,
  );

  if (serverError) {
    return {
      category: "HTTP_ERROR",
      confidence: "high",
      summary:
        `Application request returned HTTP ${serverError.status}.`,
      evidence: [
        `${serverError.method} ${serverError.url}`,
        `${serverError.status} ${serverError.statusText}`,
      ],
    };
  }

  const pageError = context.browser.pageErrors[0];

  if (pageError) {
    return {
      category: "PAGE_ERROR",
      confidence: "high",
      summary:
        "The browser page raised an unhandled JavaScript error.",
      evidence: [pageError],
    };
  }

  const clientError = context.browser.errorResponses.find(
    (response) =>
      response.status >= 400 &&
      response.status < 500,
  );

  if (clientError) {
    return {
      category: "HTTP_ERROR",
      confidence: "medium",
      summary:
        `Application request returned HTTP ${clientError.status}.`,
      evidence: [
        `${clientError.method} ${clientError.url}`,
        `${clientError.status} ${clientError.statusText}`,
      ],
    };
  }

  const assertionError = context.playwrightErrors.find(
    (error) =>
      error.message.includes("expect(") ||
      error.message.includes("toBe") ||
      error.message.includes("element(s) not found"),
  );

  if (assertionError) {
    return {
      category: "ASSERTION_FAILURE",
      confidence: "medium",
      summary:
        "A Playwright assertion did not match the observed application state.",
      evidence: [assertionError.message],
    };
  }

  const consoleError = context.browser.consoleErrors[0];

  if (consoleError) {
    return {
      category: "CONSOLE_ERROR",
      confidence: "medium",
      summary:
        "The browser emitted a console error during the test.",
      evidence: [consoleError],
    };
  }

  return {
    category: "UNKNOWN",
    confidence: "low",
    summary:
      "The captured evidence does not match a known deterministic failure category.",
    evidence: context.playwrightErrors.map(
      (error) => error.message,
    ),
  };
}
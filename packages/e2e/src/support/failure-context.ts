export type PlaywrightFailure = {
  message: string;
  stack?: string;
};

export type FailedRequest = {
  method: string;
  url: string;
  error: string;
};

export type ErrorResponse = {
  method: string;
  url: string;
  status: number;
  statusText: string;
};

export type FailureContext = {
  schemaVersion: 1;

  test: {
    title: string;
    file: string;
    project: string;
    retry: number;
    status: string;
    expectedStatus: string;
  };

  page: {
    url: string;
  };

  playwrightErrors: PlaywrightFailure[];

  browser: {
    consoleErrors: string[];
    pageErrors: string[];
    failedRequests: FailedRequest[];
    errorResponses: ErrorResponse[];
  };
};

type BuildFailureContextInput = {
  test: FailureContext["test"];
  pageUrl: string;
  playwrightErrors: PlaywrightFailure[];
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: FailedRequest[];
  errorResponses: ErrorResponse[];
};

function stripAnsi(value: string): string {
  return value.replace(/\u001B\[[0-?]*[ -/]*[@-~]/g, "");
}

export function buildFailureContext(
  input: BuildFailureContextInput,
): FailureContext {
  return {
    schemaVersion: 1,

    test: {
      ...input.test,
    },

    page: {
      url: input.pageUrl,
    },

    playwrightErrors: input.playwrightErrors.map((error) => ({
        message: stripAnsi(error.message),
        ...(error.stack
            ? {
                stack: stripAnsi(error.stack),
            }
            : {}),
    })),

    browser: {
      consoleErrors: [...input.consoleErrors],
      pageErrors: [...input.pageErrors],
      failedRequests: input.failedRequests.map((request) => ({
        ...request,
      })),
      errorResponses: input.errorResponses.map((response) => ({
        ...response,
      })),
    },
  };
}
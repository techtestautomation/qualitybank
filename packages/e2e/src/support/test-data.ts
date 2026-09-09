import type { APIRequestContext } from "@playwright/test";

export async function resetTestData(request: APIRequestContext) {
  const response = await request.post("/api/test/reset");

  if (!response.ok()) {
    throw new Error(
      `Failed to reset QualityBank test data: ${response.status()} ${await response.text()}`,
    );
  }
}
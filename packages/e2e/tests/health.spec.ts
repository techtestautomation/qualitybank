import { expect, test } from "../src/fixtures/test";

test("QualityBank health endpoint is available", async ({ request }) => {
  const response = await request.get("/api/health");

  expect(response.ok()).toBeTruthy();

  const body = await response.json();

  expect(body).toEqual({
    status: "ok",
    service: "qualitybank-web",
    database: "connected",
  });
});
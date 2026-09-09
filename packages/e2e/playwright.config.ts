import { defineConfig, devices } from "@playwright/test";

const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./tests",

  fullyParallel: false,

  forbidOnly: isCI,

  retries: isCI ? 2 : 0,

  workers: 1,

  reporter: isCI
    ? [
        ["list"],
        ["html", { outputFolder: "playwright-report", open: "never" }],
      ]
    : [
        ["list"],
        ["html", { outputFolder: "playwright-report", open: "never" }],
      ],

  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",

    trace: "on-first-retry",

    screenshot: "only-on-failure",

    video: "retain-on-failure",

    actionTimeout: 10_000,

    navigationTimeout: 15_000,
  },

  expect: {
    timeout: 5_000,
  },

  outputDir: "test-results",

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],

  webServer: {
    command: "pnpm --filter @qualitybank/web dev",
    url: "http://localhost:3000/api/health",
    reuseExistingServer: !isCI,
    timeout: 120_000,
    cwd: "../..",
    env: {
      ENABLE_TEST_RESET: "true",
    },
  },
});
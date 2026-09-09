import type {
  BrowserContext,
  Page,
  APIRequestContext,
} from "@playwright/test";

import { testUsers } from "../support/test-users";

type AuthenticateCustomerOptions = {
  request: APIRequestContext;
  context: BrowserContext;
  page: Page;
};

export async function authenticateCustomer({
  request,
  context,
  page,
}: AuthenticateCustomerOptions) {
  const response = await request.post("/api/auth/login", {
    data: {
      email: testUsers.customer.email,
      password: testUsers.customer.password,
    },
  });

  if (!response.ok()) {
    throw new Error(
      `Failed to authenticate test customer: ${response.status()} ${await response.text()}`,
    );
  }

  const storageState = await request.storageState();

  await context.addCookies(storageState.cookies);

  await page.goto("/dashboard");
}
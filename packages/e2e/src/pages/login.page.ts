import { type Locator, type Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.getByLabel("Email address", {
      exact: true,
    });

    this.passwordInput = page.getByLabel("Password", {
      exact: true,
    });

    this.signInButton = page.getByRole("button", {
      name: "Sign in",
      exact: true,
    });
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  errorMessage(message: string) {
    return this.page.getByText(message, {
      exact: true,
    });
  }
}
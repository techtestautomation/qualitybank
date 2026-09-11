# QualityBank

QualityBank is a realistic banking demo application and Quality Engineering reference project.

The repository contains both:

- a testable banking web application
- a production-style Playwright + TypeScript end-to-end automation framework

The project is designed to demonstrate practical Quality Engineering techniques including deterministic test data, API-assisted test setup, reusable Page Objects, smoke/regression classification, test isolation, and structured failure diagnostics.

> **QualityBank is a demonstration application only. It is not a real banking product.**

---

## What the Application Supports

QualityBank currently includes:

- customer authentication
- protected banking dashboard
- checking and savings accounts
- transaction history
- incoming/outgoing transaction filtering
- beneficiary transfers
- transfer validation and receipts
- deterministic personal-loan eligibility decisions
- customer profile
- logout and protected-route handling

The application is intentionally feature-frozen while the Quality Engineering capabilities around it are developed.

---

## Technology Stack

### Application

- Next.js 16
- React 19
- TypeScript
- PostgreSQL 17
- Prisma 7
- Docker

### Test Automation

- Playwright
- TypeScript
- Playwright fixtures
- Page Object Model
- APIRequestContext
- HTML reporting
- Playwright traces
- screenshots and video on failure
- structured JSON failure diagnostics

### Tooling

- Node.js
- pnpm workspace
- Docker Compose

---

## Repository Structure

```text
qualitybank/
├── apps/
│   └── web/                     # QualityBank Next.js application
│
├── packages/
│   └── e2e/                     # Playwright automation framework
│       ├── src/
│       │   ├── fixtures/        # Test lifecycle and authentication fixtures
│       │   ├── pages/           # Page Objects
│       │   └── support/         # Test data and users
│       │
│       ├── tests/
│       │   ├── accounts.spec.ts
│       │   ├── auth.spec.ts
│       │   ├── dashboard.spec.ts
│       │   ├── health.spec.ts
│       │   ├── loans.spec.ts
│       │   ├── logout.spec.ts
│       │   ├── profile.spec.ts
│       │   └── transfers.spec.ts
│       │
│       ├── playwright.config.ts
│       └── package.json
│
├── docker-compose.yml
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

---

# Local Setup

## Prerequisites

Install:

- Node.js
- pnpm
- Docker

Clone the repository and install dependencies:

```bash
pnpm install
```

Install the Playwright Chromium browser if required:

```bash
pnpm --filter @qualitybank/playwright exec playwright install chromium
```

---

## Start PostgreSQL

From the repository root:

```bash
docker compose up -d
```

The QualityBank PostgreSQL instance is exposed locally on port:

```text
5435
```

---

## Environment Configuration

Create:

```text
apps/web/.env
```

using the project environment example.

The local database connection is:

```env
DATABASE_URL="postgresql://qualitybank:qualitybank@localhost:5435/qualitybank"
```

Enable the deterministic automation reset endpoint locally:

```env
ENABLE_TEST_RESET=true
```

The destructive reset endpoint is disabled in production.

---

## Seed the Demo Database

```bash
pnpm --filter @qualitybank/web db:seed
```

The deterministic demo customer is:

```text
Email:    qa.customer@qualitybank.test
Password: QualityBank123!
```

---

## Start QualityBank

From the repository root:

```bash
pnpm --filter @qualitybank/web dev
```

Open:

```text
http://localhost:3000
```

The root route redirects to the QualityBank login page.

The Next.js application serves both the frontend and backend API routes, so a separate backend process is not required.

---

## Verify Application Health

```bash
curl http://localhost:3000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "qualitybank-web",
  "database": "connected"
}
```

---

# Playwright Automation Framework

The Playwright framework is located in:

```text
packages/e2e
```

The framework currently contains **18 deterministic end-to-end tests** covering the major QualityBank workflows.

---

## Test Coverage

### Health

- application/API/database health verification

### Authentication

- valid customer login
- invalid credentials
- protected-route access

### Dashboard

- authenticated account summary

### Accounts

- account details
- incoming transaction filtering
- outgoing transaction filtering
- return to complete transaction history

### Transfers

- successful transfer to a saved beneficiary
- transfer receipt verification
- account balance mutation
- transaction ledger verification
- insufficient-funds validation
- invalid amount validation

### Loans

- approved employed-customer scenario
- rejection when requested amount exceeds eligibility rules
- rejection for student employment status

### Profile

- customer information
- navigation back to dashboard

### Logout

- session termination
- protected-route verification after logout

---

# Test Strategy

## UI Where Behaviour Matters

Authentication behaviour and primary customer journeys are tested through the browser.

Semantic Playwright locators are preferred in this order:

1. `getByRole`
2. `getByLabel`
3. visible user-facing text
4. stable test IDs only where they improve testability

The application is designed with accessibility and automation testability in mind.

---

## API-Assisted Authentication

Authentication itself is tested through the user interface.

Tests unrelated to login behaviour authenticate through the QualityBank API and inject the resulting session cookies into the browser context.

This avoids repeatedly testing the login screen and keeps feature tests focused on the behaviour they own.

---

## Deterministic Test Data

QualityBank provides a local-only test reset endpoint:

```text
POST /api/test/reset
```

The Playwright framework invokes this automatically before every test.

Each test therefore begins from the same known database state.

This prevents scenarios such as a transfer performed by one test affecting the account balance expected by another test.

Because the current strategy resets shared database state, tests deliberately execute with:

```text
workers: 1
fullyParallel: false
```

This is an intentional test-isolation decision.

Parallel execution with mutable shared data would introduce race conditions between test resets. A future parallel strategy could use per-worker databases, schemas, or independently scoped test users.

---

# Smoke and Regression Tests

The current 18 tests are classified as:

```text
7 smoke tests
11 regression tests
```

Smoke tests cover critical infrastructure and primary customer journeys.

Regression tests cover broader validation, filtering, security behaviour, and negative scenarios.

## Run Smoke Tests

```bash
pnpm --filter @qualitybank/playwright test:smoke
```

Expected:

```text
7 passed
```

## Run Regression Tests

```bash
pnpm --filter @qualitybank/playwright test:regression
```

Expected:

```text
11 passed
```

## Run the Complete Suite

```bash
pnpm --filter @qualitybank/playwright test
```

Expected:

```text
18 passed
```

## Run in Headed Mode

```bash
pnpm --filter @qualitybank/playwright test:headed
```

## Run Playwright UI Mode

```bash
pnpm --filter @qualitybank/playwright test:ui
```

## Debug Tests

```bash
pnpm --filter @qualitybank/playwright test:debug
```

---

# Page Object Model

Reusable UI behaviour is encapsulated in Page Objects under:

```text
packages/e2e/src/pages
```

Current Page Objects include:

```text
account-details.page.ts
dashboard.page.ts
loan-result.page.ts
loan.page.ts
login.page.ts
profile.page.ts
transfer-receipt.page.ts
transfer.page.ts
```

Page Objects contain reusable page interaction and locator behaviour while assertions remain primarily in the test specifications.

This keeps tests readable without creating unnecessary abstraction layers.

---

# Fixture Architecture

Shared Playwright lifecycle behaviour is implemented under:

```text
packages/e2e/src/fixtures
```

The custom fixture layer currently handles:

- deterministic database reset
- API-assisted customer authentication
- authenticated browser state
- Login Page Object injection
- automatic failure diagnostics

Tests import the custom QualityBank fixture rather than importing Playwright's base `test` directly.

---

# Failure Diagnostics

The framework captures several forms of diagnostic evidence when a test fails.

Native Playwright artifacts include:

- trace
- screenshot
- video
- HTML report

The QualityBank fixture additionally captures structured JSON diagnostic information containing:

- test name
- actual test status
- expected test status
- URL at failure
- browser console errors
- uncaught page errors
- failed network requests
- HTTP 4xx/5xx responses

Diagnostics are attached only when a test does not finish with its expected status.

This provides richer evidence than a screenshot or stack trace alone and creates a foundation for automated failure analysis.

The failure-diagnostics path has also been deliberately exercised with a controlled failing test to verify that the artifacts are generated correctly.

---

## View the HTML Report

```bash
pnpm --filter @qualitybank/playwright report
```

Test execution artifacts are stored under:

```text
packages/e2e/test-results
```

The HTML report is generated under:

```text
packages/e2e/playwright-report
```

These generated artifacts are intentionally excluded from Git.

---

# Type Checking and Code Quality

Run Playwright TypeScript validation:

```bash
pnpm --filter @qualitybank/playwright typecheck
```

Run repository linting:

```bash
pnpm lint
```

Build the repository:

```bash
pnpm build
```

---

# Quality Engineering Principles Demonstrated

This repository intentionally demonstrates engineering practices beyond simply writing browser tests.

Examples include:

- deterministic test environments
- independent test scenarios
- API-assisted test setup
- API-assisted authentication
- reusable fixture composition
- Page Object separation
- semantic locator strategy
- accessibility-oriented testability
- business-rule validation
- positive and negative testing
- state mutation verification
- transaction ledger verification
- database reset isolation
- smoke/regression classification
- diagnostic artifact collection
- structured machine-readable failure evidence
- protected-route verification
- clear separation between authentication tests and authenticated feature tests

---

# Current Test Architecture

At a high level, a typical authenticated feature test follows this flow:

```text
Playwright test
      │
      ▼
Automatic deterministic DB reset
      │
      ▼
API authentication
      │
      ▼
Session cookie injected into browser context
      │
      ▼
Authenticated QualityBank page
      │
      ▼
Page Object interaction
      │
      ▼
UI/business assertions
      │
      ▼
Failure?
  ┌───┴────┐
  │        │
 No       Yes
  │        │
 Pass     ▼
          Trace
          Screenshot
          Video
          HTML report
          Structured JSON diagnostics
```

This architecture keeps feature tests focused while retaining full UI coverage where browser behaviour itself is under test.

---

# Roadmap

## Phase 1 — QualityBank Application

**Complete**

A realistic application-under-test with deterministic workflows and testability support.

Implemented workflows include authentication, accounts, transactions, transfers, loan decisions, profile, and logout.

---

## Phase 2 — Playwright Automation Framework

**In progress**

Current capabilities include:

- 18 deterministic end-to-end tests
- reusable fixtures
- Page Objects
- deterministic database reset
- API-assisted authentication
- smoke/regression classification
- structured failure diagnostics
- Playwright tracing
- screenshots on failure
- video on failure
- HTML reporting

---

## Phase 3 — CI/CD Quality Pipeline

**Planned next**

The Playwright framework will be integrated into GitHub Actions.

The pipeline will automate:

- dependency installation
- PostgreSQL startup
- database preparation
- QualityBank application startup
- health verification
- smoke-test execution
- broader regression execution where appropriate
- test artifact retention
- quality gates

---

## Phase 4 — AI-Assisted Failure Analysis

**Planned**

The structured Playwright diagnostics will provide machine-readable evidence for automated failure classification and analysis.

Potential analysis inputs include:

- assertion failures
- current URL
- browser console errors
- uncaught page errors
- failed network requests
- HTTP error responses
- trace and execution metadata

The goal is to distinguish likely application defects, automation defects, environmental failures, and transient infrastructure issues using evidence collected during test execution.

---

# Portfolio Purpose

QualityBank is maintained as a public Quality Engineering portfolio and reference implementation.

Its purpose is to demonstrate how modern Playwright automation can be engineered around realistic application behaviour rather than isolated toy test examples.

The project focuses on the areas expected in professional automation systems:

- maintainability
- deterministic execution
- test isolation
- meaningful business coverage
- debuggability
- CI/CD readiness
- testability
- clear engineering trade-offs

The application exists primarily to provide a realistic system under test for demonstrating these Quality Engineering practices.
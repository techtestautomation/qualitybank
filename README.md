# QualityBank

QualityBank is a realistic banking demo application and Quality Engineering reference project built to demonstrate production-style test automation with **Playwright, TypeScript, CI/CD, deterministic test data, structured diagnostics, and AI-assisted failure analysis**.

The repository contains:

- a realistic banking application under test
- a maintainable Playwright automation framework
- deterministic test-data infrastructure
- pull-request and regression quality gates
- structured machine-readable failure diagnostics
- deterministic failure classification
- AI-assisted root-cause analysis for failed CI tests

> **QualityBank is a demonstration application only. It is not a real banking product.**

---

## What This Project Demonstrates

This repository is intentionally more than a collection of browser tests.

It demonstrates how a modern Quality Engineering system can be designed around:

- realistic business workflows
- deterministic execution
- test isolation
- semantic locator strategies
- API-assisted test setup
- reusable Playwright fixtures
- Page Objects
- smoke and regression separation
- GitHub Actions quality gates
- traces, screenshots, video, and HTML reporting
- structured JSON failure evidence
- deterministic failure classification
- bounded observed page-state capture
- AI-assisted root-cause diagnosis
- safe separation between AI analysis and test pass/fail decisions

The banking application itself is intentionally feature-frozen so development can focus on the Quality Engineering capabilities surrounding it.

---

# Architecture Overview

```text
                    QualityBank
                Next.js + PostgreSQL
                       │
                       ▼
               Playwright Tests
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
 Deterministic DB Reset       API Authentication
          │                         │
          └────────────┬────────────┘
                       ▼
                Browser Workflow
                       │
                       ▼
                 Assertions
                       │
                ┌──────┴──────┐
                │             │
              PASS          FAILURE
                │             │
                │             ▼
                │     Playwright artifacts
                │      • trace
                │      • screenshot
                │      • video
                │      • HTML report
                │             │
                │             ▼
                │      FailureContext JSON
                │             │
                │             ▼
                │   Deterministic classifier
                │             │
                │             ▼
                │     AI failure analysis
                │             │
                │             ▼
                │   Root-cause diagnosis
                │
                ▼
           CI quality gate
```

AI analysis is deliberately **outside the test pass/fail decision path**.

A test failure remains a test failure regardless of whether AI analysis succeeds, fails, or is unavailable.

---

# Application Under Test

QualityBank currently supports:

- customer authentication
- protected banking dashboard
- checking and savings accounts
- account details
- transaction history
- incoming/outgoing transaction filtering
- saved beneficiaries
- beneficiary transfers
- transfer validation
- transfer receipts
- account balance mutation
- transaction ledger updates
- deterministic personal-loan decisions
- customer profile
- logout
- protected-route handling

The application is designed specifically to provide realistic workflows for Quality Engineering and automation demonstrations.

---

# Technology Stack

## Application

- Next.js 16
- React 19
- TypeScript
- PostgreSQL 17
- Prisma 7
- Docker
- Docker Compose

## Test Automation

- Playwright
- TypeScript
- Playwright fixtures
- Page Object Model
- APIRequestContext
- semantic locators
- HTML reporting
- Playwright traces
- screenshots on failure
- video on failure

## Failure Analysis

- normalized JSON failure context
- deterministic failure classifier
- bounded visible-page-state capture
- OpenAI-assisted root-cause analysis
- structured AI analysis output

## CI/CD

- GitHub Actions
- PostgreSQL service containers
- deterministic database migrations and seeding
- pull-request smoke quality gate
- main-branch regression suite
- Playwright artifact retention
- AI analysis on failed regression runs

## Tooling

- Node.js 24
- pnpm workspace
- Docker Compose
- GitHub Actions

---

# Repository Structure

```text
qualitybank/
├── apps/
│   └── web/
│       ├── prisma/
│       └── src/
│
├── packages/
│   └── e2e/
│       ├── src/
│       │   ├── analysis/
│       │   │   ├── ai-analysis.ts
│       │   │   ├── ai-prompt.ts
│       │   │   ├── analysis-schema.ts
│       │   │   ├── local-analyzer.ts
│       │   │   ├── openai-analyzer.ts
│       │   │   └── run-failure-analysis.ts
│       │   │
│       │   ├── fixtures/
│       │   ├── pages/
│       │   └── support/
│       │       ├── failure-classifier.ts
│       │       ├── failure-context.ts
│       │       ├── test-data.ts
│       │       └── test-users.ts
│       │
│       ├── tests/
│       │   ├── accounts.spec.ts
│       │   ├── ai-analysis.spec.ts
│       │   ├── auth.spec.ts
│       │   ├── dashboard.spec.ts
│       │   ├── failure-classifier.spec.ts
│       │   ├── failure-context.spec.ts
│       │   ├── health.spec.ts
│       │   ├── loans.spec.ts
│       │   ├── logout.spec.ts
│       │   ├── profile.spec.ts
│       │   └── transfers.spec.ts
│       │
│       └── playwright.config.ts
│
├── .github/
│   └── workflows/
│       ├── quality-gate.yml
│       └── regression.yml
│
├── docker-compose.yml
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

---

# Test Coverage

The complete Playwright suite currently contains **26 deterministic tests**.

The current tagged suites include:

```text
7 smoke tests
19 regression tests
```

The regression suite includes both customer workflow tests and automated tests for the failure-analysis infrastructure itself.

---

## Functional Coverage

### Health

- application health
- API health
- database connectivity

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
- restoration of complete transaction history

### Transfers

- successful beneficiary transfer
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

### Failure-Analysis Infrastructure

- normalized failure-context generation
- deterministic failure classification
- network-failure classification
- HTTP-error classification
- browser page-error classification
- assertion-failure classification
- unknown-failure fallback
- real Playwright assertion pattern classification
- structured AI request generation

---

# Test Strategy

## UI Where Browser Behaviour Matters

Authentication and primary customer workflows are tested through the browser.

Semantic Playwright locators are preferred in this order:

1. `getByRole`
2. `getByLabel`
3. user-facing text
4. stable `data-testid` attributes only where they improve testability

This encourages accessible UI design while avoiding brittle implementation-dependent selectors.

---

## API-Assisted Authentication

Authentication itself is tested through the user interface.

Tests that do not own login behaviour authenticate through the QualityBank API and establish the authenticated browser state directly.

This avoids repeatedly exercising the login screen and keeps feature tests focused on their own behaviour.

---

# Deterministic Test Data

QualityBank exposes a test-only reset endpoint:

```text
POST /api/test/reset
```

The Playwright fixture invokes this automatically before each applicable test.

Every test therefore begins from the same known application state.

This prevents mutations from one test, such as transferring money, from changing the expected state of another test.

The destructive endpoint is disabled unless explicitly enabled for testing.

---

## Why Tests Run With One Worker

The current Playwright configuration deliberately uses:

```text
workers: 1
fullyParallel: false
```

The test environment uses a shared mutable database that is reset between tests.

Parallel tests performing independent resets against the same database would create data races and nondeterministic behaviour.

This is an intentional engineering trade-off rather than an accidental framework limitation.

A future high-scale strategy could introduce:

- per-worker databases
- per-worker schemas
- dynamically provisioned users
- isolated test-data namespaces

For the current portfolio workload, deterministic execution is prioritized over unnecessary parallelism.

---

# Running Tests

## Smoke Suite

```bash
pnpm --filter @qualitybank/playwright test:smoke
```

Current expected result:

```text
7 passed
```

---

## Regression Suite

```bash
pnpm --filter @qualitybank/playwright test:regression
```

Current expected result:

```text
19 passed
```

---

## Complete Suite

```bash
pnpm --filter @qualitybank/playwright test
```

Current expected result:

```text
26 passed
```

---

## Headed Mode

```bash
pnpm --filter @qualitybank/playwright test:headed
```

---

## Playwright UI Mode

```bash
pnpm --filter @qualitybank/playwright test:ui
```

---

## Debug Mode

```bash
pnpm --filter @qualitybank/playwright test:debug
```

---

## View HTML Report

```bash
pnpm --filter @qualitybank/playwright report
```

Generated test artifacts are stored under:

```text
packages/e2e/test-results
```

The HTML report is generated under:

```text
packages/e2e/playwright-report
```

Generated reports and failure artifacts are excluded from Git.

---

# Fixture Architecture

Shared Playwright lifecycle behaviour is implemented under:

```text
packages/e2e/src/fixtures
```

The fixture layer handles:

- deterministic database reset
- API-assisted authentication
- authenticated browser state
- reusable Page Object injection
- browser console-error collection
- page-error collection
- failed-request collection
- HTTP-error collection
- bounded observed page-state capture
- normalized failure diagnostics
- deterministic failure classification

Tests consume the QualityBank fixture rather than Playwright's base fixture directly.

---

# Page Object Model

Reusable browser interaction is encapsulated under:

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

Page Objects own reusable selectors and interaction behaviour.

Business assertions remain primarily in the test specifications so that tests remain readable and behaviour-focused.

---

# Structured Failure Diagnostics

When a test fails, native Playwright evidence can include:

- HTML report
- trace
- screenshot
- video
- stack trace

QualityBank supplements these with:

```text
qualitybank-diagnostics.json
```

The normalized diagnostic contract includes:

- test title
- test file
- Playwright project
- retry number
- actual status
- expected status
- page URL
- bounded observed visible page text
- page title
- Playwright assertion errors
- browser console errors
- uncaught page errors
- failed requests
- HTTP 4xx/5xx responses

The purpose is to convert an otherwise human-oriented failure into structured evidence that can be consumed programmatically.

---

# Deterministic Failure Classification

The structured failure context is first evaluated without AI.

The classifier currently recognizes:

```text
NETWORK_FAILURE
HTTP_ERROR
PAGE_ERROR
ASSERTION_FAILURE
CONSOLE_ERROR
UNKNOWN
```

Classification precedence is intentional.

For example, a failing API request should be treated as stronger underlying evidence than a later UI assertion that merely observes the resulting symptom.

Typical priority:

```text
Network failure
      ↓
HTTP 5xx
      ↓
Page error
      ↓
HTTP 4xx
      ↓
Assertion failure
      ↓
Console error
      ↓
Unknown
```

This layer remains fully deterministic and requires no external AI service.

---

# AI-Assisted Failure Analysis

After deterministic classification, a failed test can optionally be sent for AI-assisted diagnosis.

The analysis input consists of:

```text
FailureContext
+
Deterministic Classification
+
Bounded Observed Page State
```

The AI is instructed to reason only from captured evidence and not invent application behaviour.

The generated artifact is:

```text
qualitybank-ai-analysis.json
```

A typical result contains:

```json
{
  "schemaVersion": 1,
  "summary": "...",
  "probableRootCause": "...",
  "confidence": "high",
  "evidence": [
    "..."
  ],
  "recommendedActions": [
    "..."
  ]
}
```

---

# Example: AI Root-Cause Analysis

A controlled regression failure was introduced to validate the complete CI pipeline.

The test expected a dashboard heading matching:

```text
Welcome back Wrong
```

The captured browser state showed:

```text
Welcome back, Quality
```

There were:

```text
0 console errors
0 page errors
0 failed requests
0 HTTP error responses
```

The deterministic classifier identified the failure as an assertion failure.

The AI analysis concluded that the assertion expected customer text that did not match the observed dashboard content and recommended inspecting the assertion and controlled customer data.

This is more useful than simply reporting:

```text
element(s) not found
```

because the system correlates the failed assertion with the observed browser state and supporting technical evidence.

---

## Second Validated Example

A dashboard balance assertion was deliberately changed from:

```text
173 650,00 kr
```

to:

```text
173 651,00 kr
```

The captured page state contained:

```text
Total balance       173 650,00 kr
Checking Account    125 450,00 kr
Savings Account      48 200,00 kr
```

The AI analysis identified that:

```text
125 450 + 48 200 = 173 650
```

and concluded with high confidence that the test expectation was inconsistent with both the rendered total and the component account balances.

This demonstrates reasoning across multiple pieces of captured failure evidence rather than merely paraphrasing the Playwright exception.

---

# AI Safety and Engineering Boundaries

AI is deliberately treated as a diagnostic assistant, not a test oracle.

```text
Successful test
    → no AI call

Failed test
    → deterministic evidence captured
    → deterministic classification
    → optional AI diagnosis
```

The AI layer:

- cannot turn a failed test into a passed test
- cannot modify test results
- is not required for normal Playwright execution
- is not required for deterministic classification
- can fail independently without hiding the original failure
- runs only when failure analysis is requested

This keeps the test system deterministic while allowing AI to improve debugging efficiency.

---

## Data Sent for Analysis

The system intentionally does not send unrestricted browser state.

The bounded diagnostic context includes:

- page URL
- page title
- limited visible body text
- assertion failure
- console errors
- page errors
- request URLs and status information

The implementation does **not intentionally capture**:

- cookies
- authorization headers
- local storage
- session tokens
- passwords
- unrestricted HTML
- request bodies

Observed visible text is bounded before being included in the diagnostic context.

---

# Running Failure Analysis Locally

The deterministic analyzer can process a failed test result directory:

```bash
pnpm --filter @qualitybank/playwright analyze:failure \
  test-results/<failed-test-directory>
```

This produces:

```text
qualitybank-ai-analysis.json
```

using the local deterministic analysis path.

---

## Enable OpenAI Analysis

Set the API key in the shell environment:

```bash
export OPENAI_API_KEY="<your-api-key>"
```

Do not commit the API key to Git.

Then run:

```bash
AI_FAILURE_ANALYSIS=true \
pnpm --filter @qualitybank/playwright analyze:failure \
  test-results/<failed-test-directory>
```

The failure-analysis runner switches from the local analyzer to the OpenAI provider.

Successful tests do not generate API calls.

---

# CI/CD Quality Pipeline

QualityBank uses two GitHub Actions workflows.

---

## Pull Request Quality Gate

```text
.github/workflows/quality-gate.yml
```

The pull-request quality gate performs the fast validation path, including:

- dependency installation
- Prisma client generation
- database migration
- deterministic database seed
- TypeScript validation
- linting
- application build
- Playwright browser setup
- smoke-test execution
- Playwright report retention
- failure artifact retention

This workflow runs for pull requests targeting `main`.

It can also be started manually.

---

# Regression Pipeline

```text
.github/workflows/regression.yml
```

The broader regression workflow runs on pushes to:

```text
main
```

It performs:

- PostgreSQL service startup
- dependency installation
- Prisma client generation
- database migration
- deterministic data seeding
- Chromium installation
- regression-suite execution
- Playwright artifact retention

If regression tests fail, an additional step:

```text
Analyze failed tests with AI
```

searches the Playwright result directories for QualityBank diagnostic artifacts and runs AI analysis for each detected failure.

A normal successful run skips this step entirely.

---

# CI Failure Flow

```text
Push to main
     │
     ▼
Regression tests
     │
 ┌───┴──────────┐
 │              │
PASS           FAIL
 │              │
 │              ▼
 │       Capture diagnostics
 │              │
 │              ▼
 │       Classify failure
 │              │
 │              ▼
 │        AI diagnosis
 │              │
 │              ▼
 │       Upload artifacts
 │
 ▼
Workflow succeeds
```

Importantly, AI analysis does not replace or suppress the original failed regression result.

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

Install Chromium for Playwright if required:

```bash
pnpm --filter @qualitybank/playwright exec playwright install chromium
```

---

# PostgreSQL Configuration

Docker Compose uses environment-driven configuration.

Create a local root `.env` using the project's example configuration.

Example local values:

```env
POSTGRES_USER=qualitybank
POSTGRES_PASSWORD=qualitybank
POSTGRES_DB=qualitybank
```

These credentials are for the disposable local demonstration database only.

Start PostgreSQL:

```bash
docker compose up -d
```

The database is exposed locally on:

```text
localhost:5435
```

---

# Application Environment

Create:

```text
apps/web/.env
```

Example:

```env
DATABASE_URL="postgresql://qualitybank:qualitybank@localhost:5435/qualitybank"
ENABLE_TEST_RESET=true
```

The test reset endpoint should not be enabled in production.

---

# Seed Demo Data

```bash
pnpm --filter @qualitybank/web db:seed
```

The deterministic demo customer is:

```text
Email:    qa.customer@qualitybank.test
Password: QualityBank123!
```

The credentials exist only for the public demonstration application.

---

# Start QualityBank

```bash
pnpm --filter @qualitybank/web dev
```

Open:

```text
http://localhost:3000
```

Use `localhost` rather than `127.0.0.1` for the development application and Playwright environment.

The Next.js application hosts both the UI and API routes, so a separate backend process is not required.

---

# Verify Health

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

# Engineering Decisions

## Determinism Before Parallelism

The current database-reset strategy favors repeatability over unnecessary test concurrency.

`workers: 1` is therefore deliberate.

---

## Semantic Locators Before Implementation Selectors

Tests target user-visible and accessibility-oriented contracts rather than CSS structure.

---

## API Setup Without Replacing UI Testing

APIs are used to establish prerequisites efficiently.

User behaviour is still tested through the browser where the browser experience is the behaviour under test.

---

## Assertions Stay Close to Tests

Page Objects encapsulate reusable interaction behaviour, while most assertions remain visible in the specifications.

This avoids creating overly abstract test frameworks that are difficult to understand.

---

## Diagnostics Must Not Break Tests

Diagnostic capture is defensive.

If observed page-state collection fails, it must not change the original test result.

---

## AI Is Advisory

AI provides a probable diagnosis and recommended investigation steps.

It does not determine whether the build succeeds.

---

# Quality Engineering Principles Demonstrated

QualityBank demonstrates:

- deterministic environments
- independent scenarios
- API-assisted setup
- API-assisted authentication
- reusable fixture composition
- Page Object design
- semantic locator strategies
- accessibility-oriented testability
- business-rule validation
- positive testing
- negative testing
- mutation verification
- transaction ledger validation
- protected-route testing
- database-reset isolation
- smoke/regression separation
- CI quality gates
- diagnostic artifact collection
- structured machine-readable evidence
- deterministic failure classification
- observed-state capture
- AI-assisted root-cause analysis
- explicit AI trust boundaries
- failure artifact retention
- clear engineering trade-offs

---

# Project Status

## QualityBank Application

**Complete / feature-frozen**

The application provides sufficient realistic workflows for automation demonstrations.

---

## Playwright Automation Framework

**Complete for portfolio scope**

Current capabilities include:

- 26 deterministic automated tests
- 7 smoke tests
- 19 regression tests
- Page Objects
- custom fixtures
- deterministic database reset
- API authentication
- structured diagnostics
- traces
- screenshots
- video
- HTML reporting

---

## CI/CD Quality Pipeline

**Complete**

Implemented:

- pull-request quality gate
- main-branch regression execution
- PostgreSQL service
- migrations
- deterministic seeding
- smoke and regression separation
- report retention
- failure artifact retention

---

## AI-Assisted Failure Analysis

**Complete**

Implemented and validated:

- normalized failure context
- ANSI-cleaned Playwright errors
- deterministic failure classification
- bounded observed page state
- structured AI request contract
- local deterministic analysis
- OpenAI analysis provider
- structured JSON analysis output
- GitHub Actions execution on regression failure
- secure GitHub API-key secret
- no AI call for successful test runs

---

# Portfolio Purpose

QualityBank is maintained as a public Quality Engineering portfolio and reference implementation.

Its purpose is to demonstrate how modern test automation can be engineered around realistic application behaviour rather than isolated toy examples.

The focus is on the characteristics expected of professional automation systems:

- maintainability
- deterministic execution
- realistic business coverage
- test isolation
- debuggability
- CI/CD integration
- failure triage
- secure secret handling
- testability
- clear architectural decisions
- responsible use of AI in Quality Engineering

The banking application exists primarily as a realistic system under test for demonstrating these engineering practices.
import {
  readFile,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import {
  buildAiAnalysisRequest,
} from "./ai-analysis";
import {
  analyzeFailureLocally,
} from "./local-analyzer";
import type {
  FailureClassification,
} from "../support/failure-classifier";
import type {
  FailureContext,
} from "../support/failure-context";
import {
  analyzeFailureWithOpenAI,
} from "./openai-analyzer";

async function main() {
  const directory = process.argv
  .slice(2)
  .find((argument) => argument !== "--");

  if (!directory) {
    throw new Error(
      "Usage: run-failure-analysis <test-result-directory>",
    );
  }

  const diagnosticsPath = path.join(
    directory,
    "qualitybank-diagnostics.json",
  );

  const classificationPath = path.join(
    directory,
    "qualitybank-classification.json",
  );

  const outputPath = path.join(
    directory,
    "qualitybank-ai-analysis.json",
  );

  const failureContext = JSON.parse(
    await readFile(diagnosticsPath, "utf8"),
  ) as FailureContext;

  const classification = JSON.parse(
    await readFile(classificationPath, "utf8"),
  ) as FailureClassification;

  const request = buildAiAnalysisRequest(
    failureContext,
    classification,
  );

  const useAi =
    process.env.AI_FAILURE_ANALYSIS === "true";

  const analysis = useAi
    ? await analyzeFailureWithOpenAI(request)
    : analyzeFailureLocally(request);

  console.log(
    `Failure analyzer: ${useAi ? "OpenAI" : "local"}`,
  );
  
  await writeFile(
    outputPath,
    JSON.stringify(analysis, null, 2),
    "utf8",
  );

  console.log(
    `Failure analysis written to ${outputPath}`,
  );
}

main().catch((error: unknown) => {
  console.error(
    "Failed to analyze Playwright failure.",
    error,
  );

  process.exitCode = 1;
});
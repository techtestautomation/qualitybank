import OpenAI from "openai";

import type { AiFailureAnalysis } from "./analysis-schema";
import type { AiAnalysisRequest } from "./ai-analysis";
import { buildAiAnalysisPrompt } from "./ai-prompt";

const MODEL =
  process.env.OPENAI_MODEL ?? "gpt-5.6-luna";

export async function analyzeFailureWithOpenAI(
  request: AiAnalysisRequest,
): Promise<AiFailureAnalysis> {
  const client = new OpenAI();

  const response = await client.responses.create({
    model: MODEL,

    input: buildAiAnalysisPrompt(request),

    store: false,

    text: {
      format: {
        type: "json_schema",
        name: "qualitybank_failure_analysis",
        strict: true,

        schema: {
          type: "object",
          additionalProperties: false,

          properties: {
            schemaVersion: {
              type: "integer",
              enum: [1],
            },

            summary: {
              type: "string",
            },

            probableRootCause: {
              type: "string",
            },

            confidence: {
              type: "string",
              enum: ["high", "medium", "low"],
            },

            evidence: {
              type: "array",
              items: {
                type: "string",
              },
            },

            recommendedActions: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },

          required: [
            "schemaVersion",
            "summary",
            "probableRootCause",
            "confidence",
            "evidence",
            "recommendedActions",
          ],
        },
      },
    },
  });

  if (!response.output_text) {
    throw new Error(
      "OpenAI returned no failure-analysis output.",
    );
  }

  return JSON.parse(
    response.output_text,
  ) as AiFailureAnalysis;
}
import type {
  AiAnalysisRequest,
} from "./ai-analysis";

export function buildAiAnalysisPrompt(
  request: AiAnalysisRequest,
): string {
  return [
    "You are analyzing an automated Playwright test failure.",
    "",
    "Determine the most probable root cause using only the supplied evidence.",
    "",
    "Do not invent application behavior, network failures, browser errors, or test data.",
    "",
    "Distinguish between the immediate test symptom and the probable underlying cause.",
    "",
    "Return a concise diagnosis containing:",
    "- summary",
    "- probableRootCause",
    "- confidence: high, medium, or low",
    "- evidence",
    "- recommendedActions",
    "",
    "Failure evidence:",
    JSON.stringify(request, null, 2),
  ].join("\n");
}
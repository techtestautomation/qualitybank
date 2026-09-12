import type {
  FailureClassification,
} from "../support/failure-classifier";
import type {
  FailureContext,
} from "../support/failure-context";

export type AiAnalysisRequest = {
  schemaVersion: 1;
  failureContext: FailureContext;
  deterministicClassification: FailureClassification;
};

export function buildAiAnalysisRequest(
  failureContext: FailureContext,
  deterministicClassification: FailureClassification,
): AiAnalysisRequest {
  return {
    schemaVersion: 1,
    failureContext,
    deterministicClassification,
  };
}
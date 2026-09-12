export type AnalysisConfidence =
  | "high"
  | "medium"
  | "low";

export type AiFailureAnalysis = {
  schemaVersion: 1;
  summary: string;
  probableRootCause: string;
  confidence: AnalysisConfidence;
  evidence: string[];
  recommendedActions: string[];
};
export type Locale = "ru" | "en";
export type Tone = "soft" | "classic" | "sharp";
export type CriterionId =
  | "transparency"
  | "participant_risk"
  | "disguised_sales"
  | "pressure"
  | "value"
  | "distribution";

export interface Criterion {
  id: CriterionId;
  risk: number; // 0 = no red flags in the supplied text, 3 = strong concern
  explanation: string;
  evidence: string; // verbatim excerpt or an explicit indication that evidence is absent
}

export interface AnalysisReport {
  formal: {
    headline: string;
    summary: string;
    caveat: string;
    recommendation: string;
    criteria: Criterion[];
    riskIndex: number; // heuristic 0-10, derived deterministically from six criteria
    riskLevel: "low" | "medium" | "high";
  };
  satire: {
    title: string;
    paragraphs: string[];
    observations: string[];
    conclusion: string;
  };
  model: string;
  quota: QuotaStatus;
}

export interface QuotaStatus {
  state: "ready" | "unconfigured" | "unavailable";
  dailyRequests: number;
  requestsPerAnalysis: number;
  remainingAnalyses: number | null;
  usedRequests: number | null;
  resetAt: string;
}

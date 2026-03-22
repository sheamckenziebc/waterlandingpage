/** Core input data — the 5-7 figures a utility leader knows off the top of their head */
export interface UtilityInputs {
  /** Last fiscal year water fund total revenue */
  totalRevenue: number;
  /** Last fiscal year total operating expense */
  totalOperatingExpense: number;
  /** Estimated annual debt service */
  annualDebtService: number;
  /** Current unrestricted cash / ending fund balance */
  unrestrictedCash: number;
  /** Estimated annual capital need */
  annualCapitalNeed: number;
  /** Current average monthly residential bill (optional — 0 means unknown) */
  avgMonthlyBill: number;
  /** Optional: five-year capital need total */
  fiveYearCapitalTotal: number;
  /** Optional: minimum reserve target */
  minimumReserveTarget: number;
  /** Fallback: monthly base charge if avg bill unknown */
  baseCharge: number;
  /** Fallback: volumetric rate (per 1000 gal) if avg bill unknown */
  volumetricRate: number;
}

export const emptyInputs: UtilityInputs = {
  totalRevenue: 0,
  totalOperatingExpense: 0,
  annualDebtService: 0,
  unrestrictedCash: 0,
  annualCapitalNeed: 0,
  avgMonthlyBill: 0,
  fiveYearCapitalTotal: 0,
  minimumReserveTarget: 0,
  baseCharge: 0,
  volumetricRate: 0,
};

/** Health indicator levels */
export type HealthLevel = 'healthy' | 'caution' | 'critical';

/** Core diagnostic metrics */
export interface DiagnosticResults {
  annualSurplusDeficit: number;
  operatingCoverage: number;
  operatingCoverageHealth: HealthLevel;
  debtPressure: number;
  debtPressureHealth: HealthLevel;
  capitalFundingGap: number;
  capitalFundingGapHealth: HealthLevel;
  reserveRunwayMonths: number;
  reserveAdequacy: number;
  reserveHealth: HealthLevel;
  overallHealth: HealthLevel;
}

/** Planning posture */
export type ScenarioName = 'Stabilize' | 'Catch Up' | 'Fully Fund';

/** Rate adjustment scenario result */
export interface ScenarioResult {
  name: ScenarioName;
  description: string;
  annualRateIncrease: number;
  estimatedNewMonthlyBill: number;
  monthlyBillIncrease: number;
  annualRevenueNeeded: number;
  additionalRevenueNeeded: number;
  yearlyProjections: YearProjection[];
  explanation: string;
  rateRangeLabel: string;
}

/** Year-by-year projection for reserve trajectory charts */
export interface YearProjection {
  year: number;
  label: string;
  revenue: number;
  totalExpenses: number;
  reserves: number;
  surplus: number;
}

/** Full analysis output */
export interface AnalysisResult {
  diagnostics: DiagnosticResults;
  scenarios: ScenarioResult[];
  primaryDrivers: string[];
  suggestedNextStep: string;
  confidenceNotes: string[];
}

/** Industry benchmarks and default assumptions */

/** Annual expense inflation rate */
export const EXPENSE_INFLATION = 0.03;

/** Annual capital cost inflation rate */
export const CAPITAL_INFLATION = 0.04;

/** Operating coverage thresholds */
export const OPERATING_COVERAGE = {
  HEALTHY: 1.25,
  CAUTION: 1.0,
} as const;

/** Debt service as % of revenue thresholds */
export const DEBT_PRESSURE = {
  HEALTHY: 0.20,
  CAUTION: 0.30,
} as const;

/** Reserve runway thresholds (months of operating expense) */
export const RESERVE_RUNWAY = {
  HEALTHY_MONTHS: 6,
  CAUTION_MONTHS: 3,
} as const;

/** Reserve adequacy: reserves as % of annual operating expense */
export const RESERVE_ADEQUACY = {
  HEALTHY: 0.50,
  CAUTION: 0.25,
} as const;

/** Capital funding gap thresholds (gap as % of revenue) */
export const CAPITAL_GAP = {
  HEALTHY: 0.05,
  CAUTION: 0.15,
} as const;

/** Scenario planning parameters */
export const SCENARIOS = {
  STABILIZE: {
    name: 'Stabilize' as const,
    description: 'Cover basic operations and debt. Minimal reserve build.',
    reserveTargetMonths: 3,
    capitalFundingPercent: 0.25,
    yearsToTarget: 5,
  },
  CATCH_UP: {
    name: 'Catch Up' as const,
    description: 'Close the funding gap and build meaningful reserves.',
    reserveTargetMonths: 6,
    capitalFundingPercent: 0.60,
    yearsToTarget: 5,
  },
  FULLY_FUND: {
    name: 'Fully Fund' as const,
    description: 'Best practice. Sustainable rates for the long term.',
    reserveTargetMonths: 9,
    capitalFundingPercent: 1.0,
    yearsToTarget: 5,
  },
} as const;

/** Projection horizon in years */
export const PROJECTION_YEARS = 10;

/** Typical residential monthly usage in gallons for fallback bill calc */
export const TYPICAL_MONTHLY_USAGE_GAL = 5000;

/** Chart colors */
export const COLORS = {
  navy: '#1B3A5C',
  civic: '#2E6DB4',
  teal: '#3AAFA9',
  amber: '#E8A838',
  danger: '#C0392B',
  surface: '#F4F6F8',
  stabilize: '#2E6DB4',
  catchUp: '#E8A838',
  fullyFund: '#3AAFA9',
  revenue: '#3AAFA9',
  expense: '#C0392B',
  reserve: '#2E6DB4',
} as const;

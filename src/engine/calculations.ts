import type {
  UtilityInputs,
  DiagnosticResults,
  HealthLevel,
} from '../types/models';
import {
  OPERATING_COVERAGE,
  DEBT_PRESSURE,
  RESERVE_ADEQUACY,
  CAPITAL_GAP,
} from '../utils/constants';

function healthLevel(
  value: number,
  healthyThreshold: number,
  cautionThreshold: number,
  higherIsBetter: boolean
): HealthLevel {
  if (higherIsBetter) {
    if (value >= healthyThreshold) return 'healthy';
    if (value >= cautionThreshold) return 'caution';
    return 'critical';
  }
  if (value <= healthyThreshold) return 'healthy';
  if (value <= cautionThreshold) return 'caution';
  return 'critical';
}

function worstHealth(...levels: HealthLevel[]): HealthLevel {
  if (levels.includes('critical')) return 'critical';
  if (levels.includes('caution')) return 'caution';
  return 'healthy';
}

export function computeDiagnostics(inputs: UtilityInputs): DiagnosticResults {
  const {
    totalRevenue,
    totalOperatingExpense,
    annualDebtService,
    unrestrictedCash,
    annualCapitalNeed,
  } = inputs;

  // 1. Annual surplus / deficit (revenue minus all obligations)
  const totalObligations = totalOperatingExpense + annualDebtService;
  const annualSurplusDeficit = totalRevenue - totalObligations;

  // 2. Operating coverage ratio = revenue / (opex + debt)
  const operatingCoverage =
    totalObligations > 0 ? totalRevenue / totalObligations : 999;
  const operatingCoverageHealth = healthLevel(
    operatingCoverage,
    OPERATING_COVERAGE.HEALTHY,
    OPERATING_COVERAGE.CAUTION,
    true
  );

  // 3. Debt pressure = debt service as % of revenue
  const debtPressure =
    totalRevenue > 0 ? annualDebtService / totalRevenue : 0;
  const debtPressureHealth = healthLevel(
    debtPressure,
    DEBT_PRESSURE.HEALTHY,
    DEBT_PRESSURE.CAUTION,
    false
  );

  // 4. Capital funding gap
  const availableForCapital = Math.max(0, annualSurplusDeficit);
  const capitalFundingGap = annualCapitalNeed - availableForCapital;
  const capitalGapRatio =
    totalRevenue > 0
      ? Math.max(0, capitalFundingGap) / totalRevenue
      : capitalFundingGap > 0
      ? 1
      : 0;
  const capitalFundingGapHealth = healthLevel(
    capitalGapRatio,
    CAPITAL_GAP.HEALTHY,
    CAPITAL_GAP.CAUTION,
    false
  );

  // 5. Reserve runway (months of operating expense)
  const monthlyOpex =
    totalOperatingExpense > 0 ? totalOperatingExpense / 12 : 1;
  const reserveRunwayMonths = unrestrictedCash / monthlyOpex;

  // 6. Reserve adequacy (reserves as % of annual opex)
  const reserveAdequacy =
    totalOperatingExpense > 0
      ? unrestrictedCash / totalOperatingExpense
      : unrestrictedCash > 0
      ? 999
      : 0;
  const reserveHealth = healthLevel(
    reserveAdequacy,
    RESERVE_ADEQUACY.HEALTHY,
    RESERVE_ADEQUACY.CAUTION,
    true
  );

  const overallHealth = worstHealth(
    operatingCoverageHealth,
    debtPressureHealth,
    capitalFundingGapHealth,
    reserveHealth
  );

  return {
    annualSurplusDeficit,
    operatingCoverage,
    operatingCoverageHealth,
    debtPressure,
    debtPressureHealth,
    capitalFundingGap,
    capitalFundingGapHealth,
    reserveRunwayMonths,
    reserveAdequacy,
    reserveHealth,
    overallHealth,
  };
}

export function identifyDrivers(
  _inputs: UtilityInputs,
  diag: DiagnosticResults
): string[] {
  const drivers: string[] = [];

  if (diag.annualSurplusDeficit < 0) {
    drivers.push(
      'Your current revenue does not cover operating expenses and debt service. This is the most immediate pressure on your finances.'
    );
  }

  if (diag.capitalFundingGap > 0) {
    drivers.push(
      `You have an estimated capital funding gap of ${formatDollars(diag.capitalFundingGap)} per year. Without additional funding, infrastructure needs may go unmet.`
    );
  }

  if (diag.reserveHealth === 'critical') {
    drivers.push(
      'Your reserves are low relative to your operating expenses. This leaves limited cushion for unexpected costs or revenue shortfalls.'
    );
  } else if (diag.reserveHealth === 'caution') {
    drivers.push(
      'Your reserves provide some cushion but are below recommended levels for a utility of your size.'
    );
  }

  if (diag.debtPressureHealth === 'critical') {
    drivers.push(
      'Debt service consumes a significant share of your revenue, limiting flexibility for other needs.'
    );
  }

  if (drivers.length === 0) {
    drivers.push(
      'Your current finances appear stable for operations. Capital planning and reserve building are the areas to watch.'
    );
  }

  return drivers;
}

export function suggestNextStep(diag: DiagnosticResults): string {
  if (diag.overallHealth === 'critical') {
    return 'Consider engaging a rate consultant or financial advisor to develop a formal rate adjustment plan. These results suggest meaningful action may be needed soon.';
  }
  if (diag.overallHealth === 'caution') {
    return 'These results suggest a closer look is warranted. A targeted rate study or internal financial review could help clarify priorities and timing.';
  }
  return 'Your utility appears to be in a relatively stable position. Periodic rate reviews (every 3-5 years) and capital planning updates will help you stay ahead.';
}

function formatDollars(n: number): string {
  return '$' + Math.round(Math.abs(n)).toLocaleString('en-US');
}

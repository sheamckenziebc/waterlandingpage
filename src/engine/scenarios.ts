import type {
  UtilityInputs,
  ScenarioResult,
  ScenarioName,
  YearProjection,
} from '../types/models';
import {
  SCENARIOS,
  EXPENSE_INFLATION,
  CAPITAL_INFLATION,
  PROJECTION_YEARS,
} from '../utils/constants';

interface ScenarioParams {
  name: ScenarioName;
  description: string;
  reserveTargetMonths: number;
  capitalFundingPercent: number;
  yearsToTarget: number;
}

function buildScenario(
  inputs: UtilityInputs,
  params: ScenarioParams
): ScenarioResult {
  const {
    totalRevenue,
    totalOperatingExpense,
    annualDebtService,
    unrestrictedCash,
    annualCapitalNeed,
    avgMonthlyBill,
  } = inputs;

  // Target reserve = N months of operating expense
  const targetReserve =
    inputs.minimumReserveTarget > 0
      ? inputs.minimumReserveTarget
      : (totalOperatingExpense / 12) * params.reserveTargetMonths;

  // How much capital to fund from rates
  const capitalFromRates = annualCapitalNeed * params.capitalFundingPercent;

  // Total annual need: opex + debt + capital portion + reserve build
  const reserveGap = Math.max(0, targetReserve - unrestrictedCash);
  const annualReserveBuild = reserveGap / params.yearsToTarget;

  const annualNeed =
    totalOperatingExpense +
    annualDebtService +
    capitalFromRates +
    annualReserveBuild;

  const additionalRevenueNeeded = Math.max(0, annualNeed - totalRevenue);

  // Rate increase needed (as a percent of current revenue, annualized)
  const annualRateIncrease =
    totalRevenue > 0
      ? Math.max(0, (annualNeed / totalRevenue - 1) / params.yearsToTarget) *
        100 +
        EXPENSE_INFLATION * 100
      : 0;

  // Clamp rate increase to reasonable range
  const clampedIncrease = Math.min(annualRateIncrease, 25);

  // Estimated bill impact
  const monthlyBillIncrease = avgMonthlyBill * (clampedIncrease / 100);
  const estimatedNewMonthlyBill = avgMonthlyBill + monthlyBillIncrease;

  // Generate year-by-year projections
  const projections = generateProjections(
    inputs,
    clampedIncrease / 100,
    params.capitalFundingPercent
  );

  // Rate range label
  const rateRangeLabel = getRateRangeLabel(clampedIncrease);

  // Plain-English explanation
  const explanation = buildExplanation(
    params.name,
    clampedIncrease,
    additionalRevenueNeeded,
    capitalFromRates,
    annualCapitalNeed,
    reserveGap,
    avgMonthlyBill
  );

  return {
    name: params.name,
    description: params.description,
    annualRateIncrease: Math.round(clampedIncrease * 10) / 10,
    estimatedNewMonthlyBill: Math.round(estimatedNewMonthlyBill * 100) / 100,
    monthlyBillIncrease: Math.round(monthlyBillIncrease * 100) / 100,
    annualRevenueNeeded: Math.round(annualNeed),
    additionalRevenueNeeded: Math.round(additionalRevenueNeeded),
    yearlyProjections: projections,
    explanation,
    rateRangeLabel,
  };
}

function generateProjections(
  inputs: UtilityInputs,
  annualIncreaseRate: number,
  capitalFundingPercent: number
): YearProjection[] {
  const projections: YearProjection[] = [];
  let revenue = inputs.totalRevenue;
  let opex = inputs.totalOperatingExpense;
  let debt = inputs.annualDebtService;
  let capNeed = inputs.annualCapitalNeed;
  let reserves = inputs.unrestrictedCash;
  const currentYear = new Date().getFullYear();

  for (let i = 0; i <= PROJECTION_YEARS; i++) {
    const capitalFromRates = capNeed * capitalFundingPercent;
    const totalExpenses = opex + debt + capitalFromRates;
    const surplus = revenue - totalExpenses;
    reserves = Math.max(0, reserves + surplus);

    projections.push({
      year: currentYear + i,
      label: i === 0 ? 'Current' : `Year ${i}`,
      revenue: Math.round(revenue),
      totalExpenses: Math.round(totalExpenses),
      reserves: Math.round(reserves),
      surplus: Math.round(surplus),
    });

    // Inflate for next year
    revenue = revenue * (1 + annualIncreaseRate);
    opex = opex * (1 + EXPENSE_INFLATION);
    capNeed = capNeed * (1 + CAPITAL_INFLATION);
    // Debt stays constant (simplified — most debt service is fixed)
  }

  return projections;
}

function getRateRangeLabel(increase: number): string {
  if (increase <= 0.5) return '0–1%';
  if (increase <= 3) return '1–3%';
  if (increase <= 5) return '3–5%';
  if (increase <= 8) return '5–8%';
  if (increase <= 12) return '8–12%';
  return '12%+';
}

function buildExplanation(
  name: ScenarioName,
  rateIncrease: number,
  additionalRevenue: number,
  capitalFromRates: number,
  totalCapitalNeed: number,
  reserveGap: number,
  avgBill: number
): string {
  const fmt = (n: number) =>
    '$' + Math.round(Math.abs(n)).toLocaleString('en-US');

  if (name === 'Stabilize') {
    if (rateIncrease < 1) {
      return `Under a stabilization approach, your current rates appear close to covering basic operations and debt. A modest adjustment of around ${rateIncrease.toFixed(1)}% per year would help keep pace with inflation. This approach funds about ${Math.round(totalCapitalNeed > 0 ? (capitalFromRates / totalCapitalNeed) * 100 : 0)}% of your estimated capital needs from rates.`;
    }
    return `To stabilize your finances, an estimated annual increase of around ${rateIncrease.toFixed(1)}% would cover operations, debt service, and a small portion of capital needs. This is the minimum to avoid falling further behind. ${reserveGap > 0 ? `It would also begin building reserves toward a basic safety net.` : ''}`;
  }

  if (name === 'Catch Up') {
    return `A catch-up approach targets closing the funding gap over time with an estimated annual increase of around ${rateIncrease.toFixed(1)}%. This would generate approximately ${fmt(additionalRevenue)} in additional annual revenue, fund a larger share of capital needs, and build reserves to a more comfortable level.${avgBill > 0 ? ` For a typical residential customer, this translates to roughly ${fmt(avgBill * rateIncrease / 100)} more per month.` : ''}`;
  }

  // Fully Fund
  return `Full funding targets sustainable, best-practice financial health. An estimated annual increase of around ${rateIncrease.toFixed(1)}% would cover 100% of estimated capital needs from rates and build reserves to industry-recommended levels. This is the most financially resilient path, though it requires the largest near-term rate adjustment.${avgBill > 0 ? ` Monthly bills would increase by roughly ${fmt(avgBill * rateIncrease / 100)}.` : ''}`;
}

export function computeScenarios(inputs: UtilityInputs): ScenarioResult[] {
  return [
    buildScenario(inputs, SCENARIOS.STABILIZE),
    buildScenario(inputs, SCENARIOS.CATCH_UP),
    buildScenario(inputs, SCENARIOS.FULLY_FUND),
  ];
}

import { useWizard } from '../context/WizardContext';
import {
  formatDollars,
  formatDollarsCompact,
  formatPercent,
  formatRatio,
  formatMonths,
} from '../engine/formatters';
import HealthBadge from '../components/HealthBadge';
import FundingGapChart from '../charts/FundingGapChart';
import ReserveTrajectoryChart from '../charts/ReserveTrajectoryChart';
import ScenarioComparisonChart from '../charts/ScenarioComparisonChart';
import { COLORS } from '../utils/constants';
import type { ScenarioResult } from '../types/models';

const scenarioColors: Record<string, string> = {
  Stabilize: COLORS.stabilize,
  'Catch Up': COLORS.catchUp,
  'Fully Fund': COLORS.fullyFund,
};

const scenarioEmoji: Record<string, string> = {
  Stabilize: '🛡',
  'Catch Up': '📈',
  'Fully Fund': '🎯',
};

function ScenarioCard({ scenario }: { scenario: ScenarioResult }) {
  const color = scenarioColors[scenario.name] || COLORS.civic;
  const emoji = scenarioEmoji[scenario.name] || '';

  return (
    <div
      className="bg-white rounded-2xl p-6 shadow-sm border-2 transition-all hover:shadow-md"
      style={{ borderColor: color + '30' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{emoji}</span>
        <h3 className="text-lg font-bold" style={{ color }}>
          {scenario.name}
        </h3>
      </div>

      <p className="text-sm text-gray-500 mb-4">{scenario.description}</p>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-500">Annual rate increase</span>
          <span className="text-2xl font-bold" style={{ color }}>
            {formatPercent(scenario.annualRateIncrease)}
          </span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-500">Rate range</span>
          <span className="text-sm font-semibold text-navy">
            {scenario.rateRangeLabel}
          </span>
        </div>

        {scenario.additionalRevenueNeeded > 0 && (
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-500">Additional revenue</span>
            <span className="text-sm font-semibold text-navy">
              {formatDollarsCompact(scenario.additionalRevenueNeeded)}/yr
            </span>
          </div>
        )}

        {scenario.monthlyBillIncrease > 0 && (
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-500">Bill impact</span>
            <span className="text-sm font-semibold text-navy">
              +{formatDollars(scenario.monthlyBillIncrease)}/mo
            </span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-gray-100">
        <p className="text-sm text-gray-600 leading-relaxed">
          {scenario.explanation}
        </p>
      </div>
    </div>
  );
}

export default function ResultsStep() {
  const { state, dispatch } = useWizard();
  const results = state.results;

  if (!results) {
    // Recalculate if results missing
    dispatch({ type: 'CALCULATE' });
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Calculating your results...</p>
      </div>
    );
  }

  const { diagnostics, scenarios, primaryDrivers, suggestedNextStep, confidenceNotes } =
    results;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Top summary card */}
      <div
        className={`rounded-2xl p-6 md:p-8 mb-8 shadow-sm border-2 ${
          diagnostics.overallHealth === 'healthy'
            ? 'bg-emerald-50 border-emerald-200'
            : diagnostics.overallHealth === 'caution'
            ? 'bg-amber-50 border-amber-200'
            : 'bg-red-50 border-red-200'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-2">
              Your Rate Checkup Results
            </h2>
            <HealthBadge level={diagnostics.overallHealth} size="lg" />
          </div>
          <button
            onClick={() => dispatch({ type: 'GO_TO_STEP', step: 1 })}
            className="text-sm text-civic hover:text-civic-light underline cursor-pointer self-start no-print"
          >
            Edit my inputs
          </button>
        </div>

        {/* Driver explanations */}
        <div className="space-y-2 mt-4">
          {primaryDrivers.map((driver, i) => (
            <p key={i} className="text-base text-navy leading-relaxed">
              {driver}
            </p>
          ))}
        </div>
      </div>

      {/* Key metrics row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Annual Surplus/Deficit"
          value={formatDollarsCompact(diagnostics.annualSurplusDeficit)}
          health={diagnostics.annualSurplusDeficit >= 0 ? 'healthy' : 'critical'}
          tooltip="Revenue minus operating expenses and debt service"
        />
        <MetricCard
          label="Operating Coverage"
          value={formatRatio(diagnostics.operatingCoverage)}
          health={diagnostics.operatingCoverageHealth}
          tooltip="Revenue divided by (operating expenses + debt). 1.25x or above is healthy."
        />
        <MetricCard
          label="Debt Pressure"
          value={formatPercent(diagnostics.debtPressure * 100, 0)}
          health={diagnostics.debtPressureHealth}
          tooltip="Debt service as a share of revenue. Below 20% is typical."
        />
        <MetricCard
          label="Reserve Runway"
          value={formatMonths(diagnostics.reserveRunwayMonths)}
          health={diagnostics.reserveHealth}
          tooltip="How many months your reserves could cover operating expenses"
        />
      </div>

      {/* Capital funding gap highlight */}
      {diagnostics.capitalFundingGap > 0 && (
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="text-lg font-semibold text-navy mb-1">
                Capital Funding Gap: {formatDollarsCompact(diagnostics.capitalFundingGap)}/year
              </h3>
              <p className="text-sm text-gray-600">
                Even after covering operations and debt, your estimated capital
                needs exceed available surplus by{' '}
                {formatDollars(diagnostics.capitalFundingGap)} per year. Without
                a plan to close this gap, infrastructure investments may be
                deferred.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scenario cards */}
      <h2 className="text-xl md:text-2xl font-bold text-navy mb-2">
        Three Ways Forward
      </h2>
      <p className="text-gray-500 mb-6">
        Each scenario takes a different approach to balancing rates, reserves, and
        capital investment. All numbers are directional estimates.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {scenarios.map((s) => (
          <ScenarioCard key={s.name} scenario={s} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <FundingGapChart
            revenue={state.inputs.totalRevenue}
            operatingExpense={state.inputs.totalOperatingExpense}
            debtService={state.inputs.annualDebtService}
            capitalNeed={state.inputs.annualCapitalNeed}
          />
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <ScenarioComparisonChart scenarios={scenarios} />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-10">
        <ReserveTrajectoryChart
          scenarios={scenarios}
          operatingExpense={state.inputs.totalOperatingExpense}
        />
      </div>

      {/* Suggested next step */}
      <div className="bg-navy rounded-2xl p-6 md:p-8 mb-8 text-white">
        <h3 className="text-lg font-semibold mb-2">Suggested Next Step</h3>
        <p className="text-blue-100 leading-relaxed">{suggestedNextStep}</p>
      </div>

      {/* Confidence notes */}
      {confidenceNotes.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-8">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">
            Notes on these results
          </h4>
          <ul className="space-y-1">
            {confidenceNotes.map((note, i) => (
              <li key={i} className="text-sm text-gray-500 flex gap-2">
                <span className="text-gray-400">•</span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-center py-6 border-t border-gray-100">
        <p className="text-xs text-gray-400 max-w-2xl mx-auto leading-relaxed">
          <strong>Directional estimate only.</strong> This is not a formal
          cost-of-service study, engineering analysis, or regulatory
          recommendation. Results are based on simplified assumptions and the
          figures you provided. For rate-setting decisions, consult a qualified
          rate consultant or financial advisor.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pb-10 no-print">
        <button
          onClick={() => dispatch({ type: 'GO_TO_STEP', step: 1 })}
          className="px-6 py-3 bg-white border-2 border-navy text-navy font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Adjust My Inputs
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-light transition-colors cursor-pointer"
        >
          Print / Save as PDF
        </button>
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium cursor-pointer"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}

/** Small metric card component */
function MetricCard({
  label,
  value,
  health,
  tooltip,
}: {
  label: string;
  value: string;
  health: 'healthy' | 'caution' | 'critical';
  tooltip: string;
}) {
  const bgMap = {
    healthy: 'bg-emerald-50 border-emerald-100',
    caution: 'bg-amber-50 border-amber-100',
    critical: 'bg-red-50 border-red-100',
  };
  const textMap = {
    healthy: 'text-emerald-700',
    caution: 'text-amber-700',
    critical: 'text-red-700',
  };

  return (
    <div
      className={`rounded-xl p-4 border ${bgMap[health]}`}
      title={tooltip}
    >
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${textMap[health]}`}>{value}</p>
    </div>
  );
}

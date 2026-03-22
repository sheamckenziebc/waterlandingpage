import { useState } from 'react';
import { useWizard } from '../context/WizardContext';
import CurrencyInput from '../components/CurrencyInput';
import NavigationButtons from '../components/NavigationButtons';
import StepIndicator from '../components/StepIndicator';
import { STEP_LABELS } from './stepLabels';
import { TOTAL_STEPS } from '../context/WizardContext';
import { validateStep1 } from '../utils/validation';

export default function RevenueExpenseStep() {
  const { state, dispatch } = useWizard();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const validationErrors = validateStep1(state.inputs);
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((e) => {
        errorMap[e.field] = e.message;
      });
      setErrors(errorMap);
      return;
    }
    setErrors({});
    dispatch({ type: 'NEXT_STEP' });
  };

  return (
    <div className="max-w-xl mx-auto">
      <StepIndicator
        currentStep={state.currentStep}
        totalSteps={TOTAL_STEPS}
        labels={STEP_LABELS}
      />

      <h2 className="text-2xl md:text-3xl font-bold text-navy mb-2">
        Revenue & Operating Expenses
      </h2>
      <p className="text-gray-500 mb-8">
        These are the two most fundamental numbers for your water fund. Think of
        revenue as what comes in, and operating expenses as what goes out to keep
        the system running.
      </p>

      <CurrencyInput
        label="Last Fiscal Year — Total Water Fund Revenue"
        value={state.inputs.totalRevenue}
        onChange={(v) =>
          dispatch({ type: 'SET_FIELD', field: 'totalRevenue', value: v })
        }
        helperText="All revenue collected by the water fund, including rates, fees, and charges."
        whereToFind="Look in your Comprehensive Annual Financial Report (CAFR) or budget document under 'Water Fund Revenue' or 'Water Enterprise Fund — Total Revenue.' Your finance director will know this number."
        error={errors.totalRevenue}
      />

      <CurrencyInput
        label="Last Fiscal Year — Total Operating Expense"
        value={state.inputs.totalOperatingExpense}
        onChange={(v) =>
          dispatch({
            type: 'SET_FIELD',
            field: 'totalOperatingExpense',
            value: v,
          })
        }
        helperText="Day-to-day costs: salaries, chemicals, electricity, maintenance, and administration."
        whereToFind="Found in the same CAFR or budget document under 'Water Fund Operating Expenses' or 'Water Enterprise Fund — Operating Expenditures.' This should exclude debt service and capital outlays."
        error={errors.totalOperatingExpense}
      />

      {/* Live feedback */}
      {state.inputs.totalRevenue > 0 &&
        state.inputs.totalOperatingExpense > 0 && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-4">
            <p className="text-sm text-navy">
              <span className="font-semibold">Quick check: </span>
              {state.inputs.totalRevenue > state.inputs.totalOperatingExpense ? (
                <>
                  Revenue exceeds operating expenses by{' '}
                  <span className="font-semibold text-teal">
                    $
                    {Math.round(
                      state.inputs.totalRevenue -
                        state.inputs.totalOperatingExpense
                    ).toLocaleString()}
                  </span>
                  . That surplus helps cover debt and capital needs.
                </>
              ) : (
                <>
                  Operating expenses exceed revenue by{' '}
                  <span className="font-semibold text-danger">
                    $
                    {Math.round(
                      state.inputs.totalOperatingExpense -
                        state.inputs.totalRevenue
                    ).toLocaleString()}
                  </span>
                  . This means the fund is drawing down reserves or deferring
                  costs.
                </>
              )}
            </p>
          </div>
        )}

      <NavigationButtons
        onBack={() => dispatch({ type: 'PREV_STEP' })}
        onNext={handleNext}
        disabled={
          state.inputs.totalRevenue <= 0 ||
          state.inputs.totalOperatingExpense <= 0
        }
      />
    </div>
  );
}

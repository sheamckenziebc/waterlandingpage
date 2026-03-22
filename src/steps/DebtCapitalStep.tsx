import { useState } from 'react';
import { useWizard } from '../context/WizardContext';
import CurrencyInput from '../components/CurrencyInput';
import NavigationButtons from '../components/NavigationButtons';
import StepIndicator from '../components/StepIndicator';
import { STEP_LABELS } from './stepLabels';
import { TOTAL_STEPS } from '../context/WizardContext';
import { validateStep2 } from '../utils/validation';

export default function DebtCapitalStep() {
  const { state, dispatch } = useWizard();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const validationErrors = validateStep2(state.inputs);
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
        Debt & Capital Needs
      </h2>
      <p className="text-gray-500 mb-8">
        Debt service is your annual loan or bond payment. Capital needs are what
        you need to invest in the system — pipes, treatment, storage — to keep it
        working.
      </p>

      <CurrencyInput
        label="Estimated Annual Debt Service"
        value={state.inputs.annualDebtService}
        onChange={(v) =>
          dispatch({ type: 'SET_FIELD', field: 'annualDebtService', value: v })
        }
        helperText="Total annual principal and interest payments on bonds, loans, or state revolving fund debt. Enter $0 if your utility has no debt."
        whereToFind="Found in your debt service schedule or budget. Look for 'Water Fund Debt Service' or 'Bond Payments.' Your finance director or bond counsel can provide this."
        error={errors.annualDebtService}
        optional
      />

      <CurrencyInput
        label="Estimated Annual Capital Need"
        value={state.inputs.annualCapitalNeed}
        onChange={(v) =>
          dispatch({ type: 'SET_FIELD', field: 'annualCapitalNeed', value: v })
        }
        helperText="How much should you be investing in the system each year? Think about pipe replacement, treatment upgrades, and equipment."
        whereToFind="Check your Capital Improvement Plan (CIP), asset management plan, or master plan. If you don't have one, a rough estimate works — even a best guess is better than leaving this blank."
        error={errors.annualCapitalNeed}
      />

      {/* Live context */}
      {state.inputs.annualDebtService > 0 &&
        state.inputs.totalRevenue > 0 && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-4">
            <p className="text-sm text-navy">
              <span className="font-semibold">Context: </span>
              Debt service is{' '}
              <span className="font-semibold">
                {(
                  (state.inputs.annualDebtService / state.inputs.totalRevenue) *
                  100
                ).toFixed(1)}
                %
              </span>{' '}
              of your revenue.{' '}
              {state.inputs.annualDebtService / state.inputs.totalRevenue >
              0.25
                ? 'That is on the higher side — leaving less room for capital and reserves.'
                : 'That is within a typical range for a water utility.'}
            </p>
          </div>
        )}

      <NavigationButtons
        onBack={() => dispatch({ type: 'PREV_STEP' })}
        onNext={handleNext}
        disabled={state.inputs.annualCapitalNeed <= 0}
      />
    </div>
  );
}

import { useState } from 'react';
import { useWizard } from '../context/WizardContext';
import CurrencyInput from '../components/CurrencyInput';
import NavigationButtons from '../components/NavigationButtons';
import StepIndicator from '../components/StepIndicator';
import { STEP_LABELS } from './stepLabels';
import { TOTAL_STEPS } from '../context/WizardContext';
import { validateStep3 } from '../utils/validation';

export default function ReservesBillStep() {
  const { state, dispatch } = useWizard();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [billMode, setBillMode] = useState<'avg' | 'fallback'>('avg');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleNext = () => {
    const validationErrors = validateStep3(state.inputs);
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((e) => {
        errorMap[e.field] = e.message;
      });
      setErrors(errorMap);
      return;
    }
    setErrors({});
    // Auto-compute avg bill from fallback inputs if not directly entered
    if (
      state.inputs.avgMonthlyBill === 0 &&
      state.inputs.baseCharge > 0 &&
      state.inputs.volumetricRate > 0
    ) {
      dispatch({
        type: 'SET_FIELD',
        field: 'avgMonthlyBill',
        value: state.inputs.baseCharge + state.inputs.volumetricRate * 5,
      });
    }
    // Use 5-year capital total to refine annual estimate if provided
    if (
      state.inputs.fiveYearCapitalTotal > 0 &&
      state.inputs.fiveYearCapitalTotal / 5 > state.inputs.annualCapitalNeed
    ) {
      dispatch({
        type: 'SET_FIELD',
        field: 'annualCapitalNeed',
        value: state.inputs.fiveYearCapitalTotal / 5,
      });
    }
    // Calculate results and advance to results step
    // Use setTimeout to let state updates propagate
    setTimeout(() => {
      dispatch({ type: 'CALCULATE' });
      dispatch({ type: 'NEXT_STEP' });
    }, 0);
  };

  return (
    <div className="max-w-xl mx-auto">
      <StepIndicator
        currentStep={state.currentStep}
        totalSteps={TOTAL_STEPS}
        labels={STEP_LABELS}
      />

      <h2 className="text-2xl md:text-3xl font-bold text-navy mb-2">
        Reserves & Customer Bills
      </h2>
      <p className="text-gray-500 mb-8">
        Almost done. Your reserve balance tells us how much cushion you have. The
        bill amount helps us show the customer impact of any rate adjustment.
      </p>

      <CurrencyInput
        label="Current Unrestricted Cash / Ending Fund Balance"
        value={state.inputs.unrestrictedCash}
        onChange={(v) =>
          dispatch({ type: 'SET_FIELD', field: 'unrestrictedCash', value: v })
        }
        helperText="Cash on hand that is not restricted or committed — your rainy day fund."
        whereToFind="Look in your CAFR under 'Water Enterprise Fund — Unrestricted Net Position' or 'Ending Fund Balance.' This is not total assets — just the unrestricted cash."
        error={errors.unrestrictedCash}
      />

      {/* Bill input with fallback */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-navy mb-1.5">
          Current Average Monthly Residential Bill
          <span className="ml-2 text-xs font-normal text-gray-400">
            Optional
          </span>
        </label>
        <p className="text-sm text-gray-500 mb-2">
          If you know this, enter it. If not, we can estimate from your rate
          structure, or show results as percentages only.
        </p>
      </div>

      {billMode === 'avg' ? (
        <>
          <CurrencyInput
            label=""
            value={state.inputs.avgMonthlyBill}
            onChange={(v) =>
              dispatch({ type: 'SET_FIELD', field: 'avgMonthlyBill', value: v })
            }
            placeholder="$45"
            optional
          />
          <button
            type="button"
            className="text-xs text-civic hover:text-civic-light underline underline-offset-2 cursor-pointer mb-6"
            onClick={() => setBillMode('fallback')}
          >
            I don't know the average bill — let me enter rate components instead
          </button>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <CurrencyInput
              label="Monthly Base Charge"
              value={state.inputs.baseCharge}
              onChange={(v) =>
                dispatch({ type: 'SET_FIELD', field: 'baseCharge', value: v })
              }
              placeholder="$15"
              optional
            />
            <CurrencyInput
              label="Rate per 1,000 Gallons"
              value={state.inputs.volumetricRate}
              onChange={(v) =>
                dispatch({
                  type: 'SET_FIELD',
                  field: 'volumetricRate',
                  value: v,
                })
              }
              placeholder="$6"
              optional
            />
          </div>
          {state.inputs.baseCharge > 0 && state.inputs.volumetricRate > 0 && (
            <p className="text-sm text-gray-500 mb-2">
              Estimated typical monthly bill:{' '}
              <span className="font-semibold text-navy">
                $
                {(
                  state.inputs.baseCharge +
                  state.inputs.volumetricRate * 5
                ).toFixed(2)}
              </span>{' '}
              (based on 5,000 gallons/month)
            </p>
          )}
          <button
            type="button"
            className="text-xs text-civic hover:text-civic-light underline underline-offset-2 cursor-pointer mb-6"
            onClick={() => setBillMode('avg')}
          >
            I know the average bill — let me enter that instead
          </button>
        </>
      )}

      {/* Advanced / Optional inputs */}
      <button
        type="button"
        className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer mb-4"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? '▾' : '▸'} Advanced options (optional)
      </button>

      {showAdvanced && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 mb-4 space-y-4">
          <CurrencyInput
            label="Five-Year Capital Need Total"
            value={state.inputs.fiveYearCapitalTotal}
            onChange={(v) =>
              dispatch({
                type: 'SET_FIELD',
                field: 'fiveYearCapitalTotal',
                value: v,
              })
            }
            helperText="If you know the total capital need over the next 5 years, enter it here. We'll use this to refine the annual estimate."
            optional
          />

          <CurrencyInput
            label="Minimum Reserve Target"
            value={state.inputs.minimumReserveTarget}
            onChange={(v) =>
              dispatch({
                type: 'SET_FIELD',
                field: 'minimumReserveTarget',
                value: v,
              })
            }
            helperText="If your board or council has set a specific minimum reserve target, enter it here."
            optional
          />
        </div>
      )}

      {/* Reserve health preview */}
      {state.inputs.unrestrictedCash > 0 &&
        state.inputs.totalOperatingExpense > 0 && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-4">
            <p className="text-sm text-navy">
              <span className="font-semibold">Reserve snapshot: </span>
              Your current reserves cover roughly{' '}
              <span className="font-semibold">
                {(
                  state.inputs.unrestrictedCash /
                  state.inputs.totalOperatingExpense /
                  (1 / 12)
                ).toFixed(1)}{' '}
                months
              </span>{' '}
              of operating expenses.{' '}
              {state.inputs.unrestrictedCash /
                state.inputs.totalOperatingExpense >
              0.5
                ? 'That is a solid cushion.'
                : state.inputs.unrestrictedCash /
                    state.inputs.totalOperatingExpense >
                  0.25
                ? 'That provides some cushion but is below recommended levels.'
                : 'That is below the level most experts recommend.'}
            </p>
          </div>
        )}

      <NavigationButtons
        onBack={() => dispatch({ type: 'PREV_STEP' })}
        onNext={handleNext}
        nextLabel="See My Results"
      />
    </div>
  );
}

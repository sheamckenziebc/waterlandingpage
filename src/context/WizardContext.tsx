import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react';
import { emptyInputs, type UtilityInputs, type AnalysisResult } from '../types/models';
import { computeDiagnostics, identifyDrivers, suggestNextStep } from '../engine/calculations';
import { computeScenarios } from '../engine/scenarios';
import { getConfidenceNotes } from '../utils/validation';

export interface WizardState {
  currentStep: number;
  inputs: UtilityInputs;
  results: AnalysisResult | null;
  hasCalculated: boolean;
}

type Action =
  | { type: 'SET_FIELD'; field: keyof UtilityInputs; value: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; step: number }
  | { type: 'CALCULATE' }
  | { type: 'RESET' };

const TOTAL_STEPS = 5; // 0=welcome, 1=revenue/opex, 2=debt/capital, 3=reserves/bill, 4=results

function reducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        inputs: { ...state.inputs, [action.field]: action.value },
        // Clear results when inputs change
        hasCalculated: false,
        results: null,
      };
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, TOTAL_STEPS - 1),
      };
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
      };
    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: Math.max(0, Math.min(action.step, TOTAL_STEPS - 1)),
      };
    case 'CALCULATE': {
      const diagnostics = computeDiagnostics(state.inputs);
      const scenarios = computeScenarios(state.inputs);
      const primaryDrivers = identifyDrivers(state.inputs, diagnostics);
      const suggestedNext = suggestNextStep(diagnostics);
      const confidenceNotes = getConfidenceNotes(state.inputs);

      return {
        ...state,
        results: {
          diagnostics,
          scenarios,
          primaryDrivers,
          suggestedNextStep: suggestedNext,
          confidenceNotes,
        },
        hasCalculated: true,
      };
    }
    case 'RESET':
      return {
        currentStep: 0,
        inputs: { ...emptyInputs },
        results: null,
        hasCalculated: false,
      };
    default:
      return state;
  }
}

const initialState: WizardState = {
  currentStep: 0,
  inputs: { ...emptyInputs },
  results: null,
  hasCalculated: false,
};

const WizardContext = createContext<{
  state: WizardState;
  dispatch: Dispatch<Action>;
}>({ state: initialState, dispatch: () => {} });

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <WizardContext.Provider value={{ state, dispatch }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  return useContext(WizardContext);
}

export { TOTAL_STEPS };

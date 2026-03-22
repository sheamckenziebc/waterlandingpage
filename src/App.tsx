import { useEffect, useRef } from 'react';
import { WizardProvider, useWizard } from './context/WizardContext';
import WelcomeStep from './steps/WelcomeStep';
import RevenueExpenseStep from './steps/RevenueExpenseStep';
import DebtCapitalStep from './steps/DebtCapitalStep';
import ReservesBillStep from './steps/ReservesBillStep';
import ResultsStep from './steps/ResultsStep';

function WizardContent() {
  const { state } = useWizard();
  const contentRef = useRef<HTMLDivElement>(null);
  const prevStep = useRef(state.currentStep);

  // Scroll to top and animate on step change
  useEffect(() => {
    if (prevStep.current !== state.currentStep) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const el = contentRef.current;
      if (el) {
        el.classList.remove('step-active');
        el.classList.add('step-enter');
        requestAnimationFrame(() => {
          el.classList.remove('step-enter');
          el.classList.add('step-active');
        });
      }
      prevStep.current = state.currentStep;
    }
  }, [state.currentStep]);

  const steps = [
    <WelcomeStep key="welcome" />,
    <RevenueExpenseStep key="revenue" />,
    <DebtCapitalStep key="debt" />,
    <ReservesBillStep key="reserves" />,
    <ResultsStep key="results" />,
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 no-print">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 32 32" className="w-7 h-7" aria-hidden="true">
              <defs>
                <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2E6DB4" />
                  <stop offset="100%" stopColor="#3AAFA9" />
                </linearGradient>
              </defs>
              <path
                d="M16 2 C16 2 6 14 6 20 C6 25.5 10.5 30 16 30 C21.5 30 26 25.5 26 20 C26 14 16 2 16 2Z"
                fill="url(#hg)"
              />
            </svg>
            <span className="font-semibold text-navy text-sm">
              Water Rate Checkup
            </span>
          </div>
          {state.currentStep > 0 && state.currentStep < 4 && (
            <span className="text-xs text-gray-400">
              Takes about 3 minutes
            </span>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div
          ref={contentRef}
          className="max-w-5xl mx-auto px-4 py-6 md:py-10 step-active"
        >
          {steps[state.currentStep]}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-4 no-print">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-400">
            Directional estimates for discussion purposes only. Not a formal rate study.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
}

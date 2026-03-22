import { useWizard } from '../context/WizardContext';

export default function WelcomeStep() {
  const { dispatch } = useWizard();

  return (
    <div className="max-w-2xl mx-auto text-center py-8 md:py-16">
      {/* Water drop icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-civic to-teal mb-8 shadow-lg">
        <svg
          viewBox="0 0 32 32"
          className="w-10 h-10"
          fill="white"
        >
          <path d="M16 2 C16 2 6 14 6 20 C6 25.5 10.5 30 16 30 C21.5 30 26 25.5 26 20 C26 14 16 2 16 2Z" />
        </svg>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4 tracking-tight">
        Water Rate Checkup
      </h1>

      <p className="text-xl md:text-2xl text-gray-600 mb-3 font-light">
        Are your rates keeping up?
      </p>

      <p className="text-base text-gray-500 mb-10 max-w-lg mx-auto leading-relaxed">
        Answer 5–7 questions you probably know off the top of your head.
        Get a clear, plain-English picture of where your utility stands financially
        — in under 3 minutes.
      </p>

      <button
        onClick={() => dispatch({ type: 'NEXT_STEP' })}
        className="px-10 py-4 bg-navy text-white text-lg font-semibold rounded-2xl shadow-lg hover:bg-navy-light hover:shadow-xl transition-all active:scale-[0.98] cursor-pointer"
      >
        Get Started
      </button>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="text-2xl mb-2">⏱</div>
          <h3 className="font-semibold text-navy mb-1">Under 3 minutes</h3>
          <p className="text-sm text-gray-500">
            Just 5–7 numbers. No spreadsheets, no data uploads.
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="text-2xl mb-2">📊</div>
          <h3 className="font-semibold text-navy mb-1">Clear results</h3>
          <p className="text-sm text-gray-500">
            See where you stand across operations, capital, debt, and reserves.
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="text-2xl mb-2">🎯</div>
          <h3 className="font-semibold text-navy mb-1">Actionable next steps</h3>
          <p className="text-sm text-gray-500">
            Three planning scenarios with plain-English recommendations.
          </p>
        </div>
      </div>

      <p className="mt-10 text-xs text-gray-400 max-w-md mx-auto">
        This tool provides directional estimates for discussion purposes.
        It is not a formal cost-of-service study or engineering analysis.
      </p>
    </div>
  );
}

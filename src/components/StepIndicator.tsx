interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  labels,
}: StepIndicatorProps) {
  // Don't show on welcome (0) or results (last) step
  if (currentStep === 0 || currentStep === totalSteps - 1) return null;

  const inputSteps = totalSteps - 2; // exclude welcome and results
  const activeIndex = currentStep - 1; // zero-based within input steps

  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-3">
        {Array.from({ length: inputSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= activeIndex ? 'bg-civic' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Step label */}
      <p className="text-sm text-gray-400">
        Step {activeIndex + 1} of {inputSteps}
        {labels[currentStep] && (
          <span className="ml-2 text-gray-500 font-medium">
            — {labels[currentStep]}
          </span>
        )}
      </p>
    </div>
  );
}

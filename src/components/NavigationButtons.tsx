interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  showBack?: boolean;
  disabled?: boolean;
}

export default function NavigationButtons({
  onBack,
  onNext,
  nextLabel = 'Continue',
  backLabel = 'Back',
  showBack = true,
  disabled = false,
}: NavigationButtonsProps) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
      {showBack && onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-navy transition-colors rounded-lg hover:bg-gray-100 cursor-pointer"
        >
          ← {backLabel}
        </button>
      ) : (
        <div />
      )}

      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={disabled}
          className={`px-8 py-3 text-base font-semibold rounded-xl transition-all cursor-pointer ${
            disabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-navy text-white hover:bg-navy-light shadow-md hover:shadow-lg active:scale-[0.98]'
          }`}
        >
          {nextLabel} →
        </button>
      )}
    </div>
  );
}

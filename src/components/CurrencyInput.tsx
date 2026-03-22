import { useState, useRef, useEffect } from 'react';
import { formatInputNumber, parseCurrency } from '../engine/formatters';

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  helperText?: string;
  whereToFind?: string;
  error?: string;
  optional?: boolean;
  placeholder?: string;
}

export default function CurrencyInput({
  label,
  value,
  onChange,
  helperText,
  whereToFind,
  error,
  optional,
  placeholder = '$0',
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(
    value ? formatInputNumber(value) : ''
  );
  const [focused, setFocused] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!focused) {
      setDisplayValue(value ? formatInputNumber(value) : '');
    }
  }, [value, focused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplayValue(raw);
    const parsed = parseCurrency(raw);
    onChange(parsed);
  };

  const handleFocus = () => {
    setFocused(true);
    if (value > 0) {
      setDisplayValue(Math.round(value).toString());
    }
  };

  const handleBlur = () => {
    setFocused(false);
    const parsed = parseCurrency(displayValue);
    onChange(parsed);
    setDisplayValue(parsed ? formatInputNumber(parsed) : '');
  };

  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-navy mb-1.5">
        {label}
        {optional && (
          <span className="ml-2 text-xs font-normal text-gray-400">
            Optional
          </span>
        )}
      </label>

      {helperText && (
        <p className="text-sm text-gray-500 mb-2">{helperText}</p>
      )}

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium pointer-events-none">
          $
        </span>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          className={`currency-input w-full pl-7 pr-4 py-3 text-lg rounded-xl border-2 transition-colors outline-none ${
            error
              ? 'border-danger bg-red-50'
              : focused
              ? 'border-civic bg-white'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          aria-label={label}
          aria-invalid={!!error}
        />
      </div>

      {error && <p className="text-sm text-danger mt-1">{error}</p>}

      {whereToFind && (
        <button
          type="button"
          className="text-xs text-civic hover:text-civic-light mt-1.5 underline underline-offset-2 cursor-pointer"
          onClick={() => setShowHelp(!showHelp)}
        >
          Where do I find this number?
        </button>
      )}

      {showHelp && whereToFind && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm text-navy border border-blue-100">
          {whereToFind}
        </div>
      )}
    </div>
  );
}

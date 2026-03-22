import type { UtilityInputs } from '../types/models';

export interface ValidationError {
  field: keyof UtilityInputs;
  message: string;
}

export function validateStep1(inputs: UtilityInputs): ValidationError[] {
  const errors: ValidationError[] = [];
  if (inputs.totalRevenue <= 0) {
    errors.push({
      field: 'totalRevenue',
      message: 'Please enter your total water fund revenue.',
    });
  }
  if (inputs.totalOperatingExpense <= 0) {
    errors.push({
      field: 'totalOperatingExpense',
      message: 'Please enter your total operating expenses.',
    });
  }
  if (
    inputs.totalRevenue > 0 &&
    inputs.totalOperatingExpense > 0 &&
    inputs.totalOperatingExpense > inputs.totalRevenue * 10
  ) {
    errors.push({
      field: 'totalOperatingExpense',
      message:
        'Operating expenses seem very high relative to revenue. Please double-check this figure.',
    });
  }
  return errors;
}

export function validateStep2(inputs: UtilityInputs): ValidationError[] {
  const errors: ValidationError[] = [];
  if (inputs.annualDebtService < 0) {
    errors.push({
      field: 'annualDebtService',
      message: 'Debt service cannot be negative.',
    });
  }
  if (inputs.annualCapitalNeed < 0) {
    errors.push({
      field: 'annualCapitalNeed',
      message: 'Capital needs cannot be negative.',
    });
  }
  if (inputs.annualCapitalNeed <= 0) {
    errors.push({
      field: 'annualCapitalNeed',
      message: 'Please enter your estimated annual capital need.',
    });
  }
  return errors;
}

export function validateStep3(inputs: UtilityInputs): ValidationError[] {
  const errors: ValidationError[] = [];
  if (inputs.unrestrictedCash < 0) {
    errors.push({
      field: 'unrestrictedCash',
      message: 'Cash balance cannot be negative.',
    });
  }
  return errors;
}

export function getConfidenceNotes(inputs: UtilityInputs): string[] {
  const notes: string[] = [];

  if (inputs.avgMonthlyBill === 0 && inputs.baseCharge === 0) {
    notes.push(
      'Without a current bill amount, rate change results are shown as percentages only.'
    );
  }

  if (inputs.annualCapitalNeed === 0) {
    notes.push(
      'No capital need was entered. Capital planning results may not fully reflect your situation.'
    );
  }

  if (inputs.annualDebtService === 0) {
    notes.push(
      'No debt service was entered. If your utility carries debt, results may understate total obligations.'
    );
  }

  if (
    inputs.totalRevenue > 0 &&
    inputs.totalOperatingExpense > inputs.totalRevenue * 2
  ) {
    notes.push(
      'Operating expenses are significantly higher than revenue. Please verify these figures for the most accurate results.'
    );
  }

  return notes;
}

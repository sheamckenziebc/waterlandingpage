/** Format a number as a dollar string, e.g. $1,234,567 */
export function formatDollars(n: number): string {
  if (n === 0) return '$0';
  const abs = Math.abs(Math.round(n));
  const formatted = '$' + abs.toLocaleString('en-US');
  return n < 0 ? '-' + formatted : formatted;
}

/** Format a number as a compact dollar string, e.g. $1.2M */
export function formatDollarsCompact(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1_000_000) {
    return sign + '$' + (abs / 1_000_000).toFixed(1) + 'M';
  }
  if (abs >= 1_000) {
    return sign + '$' + (abs / 1_000).toFixed(0) + 'K';
  }
  return sign + '$' + Math.round(abs).toString();
}

/** Format a number as a percentage, e.g. 4.5% */
export function formatPercent(n: number, decimals = 1): string {
  return n.toFixed(decimals) + '%';
}

/** Format a ratio as a coverage ratio, e.g. 1.25x */
export function formatRatio(n: number): string {
  if (n > 100) return '>100x';
  return n.toFixed(2) + 'x';
}

/** Format months, e.g. "6.2 months" */
export function formatMonths(n: number): string {
  if (n > 120) return '10+ years';
  if (n >= 12) return (n / 12).toFixed(1) + ' years';
  return n.toFixed(1) + ' months';
}

/** Get a health label string */
export function healthLabel(level: 'healthy' | 'caution' | 'critical'): string {
  switch (level) {
    case 'healthy':
      return 'Healthy';
    case 'caution':
      return 'Needs Attention';
    case 'critical':
      return 'Needs Action';
  }
}

/** Parse a currency string back to a number */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/** Format a number with commas for input display */
export function formatInputNumber(value: number): string {
  if (value === 0) return '';
  return Math.round(value).toLocaleString('en-US');
}

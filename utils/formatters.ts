export function formatCurrency(value: number): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '$0.00';
  }
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  });
  
  return formatter.format(value);
}

export function formatPercent(value: number): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00%';
  }
  
  const sign = value >= 0 ? '+' : '';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  // Convert to decimal for the formatter (e.g., 5.25 -> 0.0525)
  return sign + formatter.format(value / 100);
}

export function formatLargeNumber(value: number): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(2) + 'B';
  }
  
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(2) + 'M';
  }
  
  if (value >= 1_000) {
    return (value / 1_000).toFixed(2) + 'K';
  }
  
  return value.toFixed(2);
}
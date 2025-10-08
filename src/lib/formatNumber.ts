/**
 * Format numbers to shortened strings with suffixes
 * Examples: 1000 -> 1k, 1500 -> 1.5k, 1000000 -> 1M, etc.
 */
export function formatNumber(num: number, decimals: number = 1): string {
  if (num === 0) return '0';
  
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  // Define the suffixes and their thresholds
  const suffixes = [
    { value: 1e12, suffix: 'T' }, // Trillion
    { value: 1e9, suffix: 'B' },  // Billion
    { value: 1e6, suffix: 'M' },  // Million
    { value: 1e3, suffix: 'k' },  // Thousand
  ];
  
  // Find the appropriate suffix
  for (const { value, suffix } of suffixes) {
    if (absNum >= value) {
      const formatted = (absNum / value).toFixed(decimals);
      // Remove trailing zeros after decimal point
      const cleaned = parseFloat(formatted).toString();
      return `${sign}${cleaned}${suffix}`;
    }
  }
  
  // For numbers less than 1000, return as is
  return `${sign}${absNum.toString()}`;
}

/**
 * Format numbers with commas for thousands separator
 * Examples: 1000 -> 1,000, 1500000 -> 1,500,000
 */
export function formatNumberWithCommas(num: number): string {
  return num.toLocaleString();
}

/**
 * Format currency values with proper decimal places
 * Examples: 1000.5 -> $1,000.50, 0.001 -> $0.001
 */
export function formatCurrency(num: number, currency: string = '$', decimals?: number): string {
  // Auto-determine decimals based on value size
  let decimalPlaces = decimals;
  if (decimalPlaces === undefined) {
    if (num >= 1) {
      decimalPlaces = 2;
    } else if (num >= 0.01) {
      decimalPlaces = 3;
    } else if (num >= 0.001) {
      decimalPlaces = 4;
    } else {
      decimalPlaces = 6;
    }
  }
  
  return `${currency}${num.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  })}`;
}

/**
 * Format percentage values
 * Examples: 0.1234 -> 12.34%, 0.05 -> 5%
 */
export function formatPercentage(num: number, decimals: number = 2): string {
  return `${(num * 100).toFixed(decimals)}%`;
}

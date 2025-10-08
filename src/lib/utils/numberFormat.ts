/**
 * Formats a number into abbreviated format (e.g., 1K, 1.2M, 1.5B)
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted number string
 */
export function formatNumber(num: number, decimals: number = 1): string {
  if (num === 0) return '0';
  
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  // Less than 1,000
  if (absNum < 1000) {
    return sign + absNum.toString();
  }
  
  // Thousands (1K - 999K)
  if (absNum < 1000000) {
    const thousands = absNum / 1000;
    return sign + (thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(decimals)) + 'K';
  }
  
  // Millions (1M - 999M)
  if (absNum < 1000000000) {
    const millions = absNum / 1000000;
    return sign + (millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(decimals)) + 'M';
  }
  
  // Billions (1B - 999B)
  if (absNum < 1000000000000) {
    const billions = absNum / 1000000000;
    return sign + (billions % 1 === 0 ? billions.toFixed(0) : billions.toFixed(decimals)) + 'B';
  }
  
  // Trillions (1T+)
  const trillions = absNum / 1000000000000;
  return sign + (trillions % 1 === 0 ? trillions.toFixed(0) : trillions.toFixed(decimals)) + 'T';
}

/**
 * Formats a number with tooltip showing the full value
 * @param num - The number to format
 * @param decimals - Number of decimal places for abbreviated format
 * @returns Object with abbreviated and full number formats
 */
export function formatNumberWithTooltip(num: number, decimals: number = 1) {
  const abbreviated = formatNumber(num, decimals);
  const full = num.toLocaleString();
  
  return {
    abbreviated,
    full,
    shouldShowTooltip: num >= 1000, // Only show tooltip for numbers that are abbreviated
  };
}

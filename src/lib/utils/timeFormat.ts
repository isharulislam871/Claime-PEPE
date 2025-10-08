/**
 * Formats a timestamp into a relative time string (e.g., "2m ago", "1h ago", "3d ago")
 * @param timestamp - The timestamp to format (string or Date)
 * @returns Formatted relative time string
 */
export function formatRelativeTime(timestamp: string | Date): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // If the timestamp is in the future, return "just now"
  if (diffInSeconds < 0) {
    return 'just now';
  }

  // Less than 1 minute
  if (diffInSeconds < 60) {
    return diffInSeconds <= 1 ? 'just now' : `${diffInSeconds}s ago`;
  }

  // Less than 1 hour
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  // Less than 1 day
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  // Less than 1 week
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  // Less than 1 month
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  // Less than 1 year
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }

  // 1 year or more
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
}

/**
 * Formats a timestamp with both relative time and absolute time for tooltip
 * @param timestamp - The timestamp to format (string or Date)
 * @returns Object with relative time and absolute time
 */
export function formatTimestampWithTooltip(timestamp: string | Date) {
  const date = new Date(timestamp);
  const relativeTime = formatRelativeTime(timestamp);
  const absoluteTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  
  return {
    relative: relativeTime,
    absolute: absoluteTime,
  };
}

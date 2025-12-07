/**
 * Format date/time string for display
 */
export function formatDateTime(dateTime: string | null | undefined): string {
  if (!dateTime) return 'Not set';
  try {
    const date = new Date(dateTime);
    return date.toLocaleString();
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format field value for display
 */
export function formatFieldValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  return String(value);
}


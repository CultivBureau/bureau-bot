/**
 * Validate field value based on field type
 */
export function validateField(
  field: string,
  value: string | number | null | undefined
): { valid: boolean; error?: string } {
  if (value === null || value === undefined) {
    return { valid: true }; // Allow null/undefined for optional fields
  }

  if (field === 'wait_time') {
    const numValue = typeof value === 'number' ? value : Number(value);
    if (isNaN(numValue) || numValue < 0) {
      return { valid: false, error: 'Wait time must be a non-negative number' };
    }
  }

  if (field === 'webhook_url' && typeof value === 'string' && value.trim() !== '') {
    try {
      new URL(value);
    } catch {
      return { valid: false, error: 'Invalid URL format' };
    }
  }

  return { valid: true };
}

/**
 * Prepare field value for API update
 */
export function prepareFieldValue(
  field: string,
  value: string | number | null | undefined
): string | number | null {
  if (field === 'wait_time') {
    return typeof value === 'number' ? value : Number(value) || 0;
  }

  if (field === 'webhook_url') {
    return value === '' ? null : (value as string | null);
  }

  return value as string | number | null;
}


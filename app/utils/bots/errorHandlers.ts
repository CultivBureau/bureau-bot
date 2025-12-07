/**
 * Extract error message from various error formats
 */
export function extractErrorMessage(err: unknown): string {
  const errorObj = err as {
    response?: { data?: { error?: string; detail?: string } };
    message?: string;
  };

  return (
    errorObj?.response?.data?.error ||
    errorObj?.response?.data?.detail ||
    errorObj?.message ||
    'Something went wrong'
  );
}

/**
 * Format user-friendly error messages for common scenarios
 */
export function formatUserFriendlyError(error: Error | string): string {
  const errorMessage = typeof error === 'string' ? error : error.message;

  if (errorMessage.includes('Unable to connect')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  if (errorMessage.includes('Authentication') || errorMessage.includes('session')) {
    return 'Your session has expired. Please log in again.';
  }

  if (errorMessage.includes('status 400') || errorMessage.includes('status 422')) {
    return 'Invalid data provided. Please check all fields and try again.';
  }

  if (errorMessage.includes('status 401') || errorMessage.includes('status 403')) {
    return 'You do not have permission to perform this action.';
  }

  if (errorMessage.includes('status 500')) {
    return 'Server error occurred. Please try again later.';
  }

  return errorMessage;
}

/**
 * Get default error message for a specific action
 */
export function getDefaultErrorMessage(action: string): string {
  const messages: Record<string, string> = {
    fetch: 'Something went wrong while fetching bots.',
    create: 'Failed to create bot',
    update: 'Failed to update bot',
    delete: 'Failed to delete bot',
    toggle: 'Failed to toggle bot status',
    load: 'Failed to load bot data',
    refresh: 'Failed to refresh bots list',
  };

  return messages[action] || 'Something went wrong';
}


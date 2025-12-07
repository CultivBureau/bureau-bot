export interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

export interface ValidationErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
}

/**
 * Validate profile form data
 */
export function validateProfileForm(formData: ProfileFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!formData.first_name.trim()) {
    errors.first_name = 'First name is required';
  }

  if (!formData.last_name.trim()) {
    errors.last_name = 'Last name is required';
  }

  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Invalid email format';
  }

  if (!formData.phone_number.trim()) {
    errors.phone_number = 'Phone number is required';
  }

  return errors;
}

/**
 * Check if profile form has changes
 */
export function hasProfileChanges(
  original: ProfileFormData,
  current: ProfileFormData
): boolean {
  return (
    original.first_name !== current.first_name ||
    original.last_name !== current.last_name ||
    original.email !== current.email ||
    original.phone_number !== current.phone_number
  );
}


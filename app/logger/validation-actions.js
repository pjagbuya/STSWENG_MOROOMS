'use server';

import { createClient } from '@/utils/supabase/server';

/**
 * Server action to log validation errors.
 * Called from client-side useFormWithLogging wrapper.
 * Does NOT log actual field values for privacy/security.
 *
 * @param {string} formName - Name of the form where validation failed
 * @param {Array<{field: string, message: string}>} errors - Array of validation errors
 */
export async function logValidationErrors(formName, errors) {
  if (!errors || errors.length === 0) return { success: true };

  const supabase = createClient(true); // Use admin client for logging
  const timestamp = new Date();

  try {
    // Create log entries for each validation error
    const logEntries = errors.map(({ field, message }) => ({
      timestamp,
      action: 'VALIDATION_ERROR',
      method: 'VALIDATE',
      table: `form:${formName}`,
      user_id: null, // Anonymous logging
      data: JSON.stringify({
        form: formName,
        field: field,
        error: message,
        // Intentionally NOT logging values for privacy
      }),
      error: `Validation failed for field: ${field}`,
      status: 'error',
    }));

    // Batch insert all validation errors
    const { error } = await supabase.from('logs').insert(logEntries);

    if (error) {
      console.error('Failed to log validation errors:', error);
      return { success: false, error: error.message };
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Validation Errors - ${formName}]`, errors);
    }

    return { success: true };
  } catch (err) {
    console.error('Failed to log validation errors:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Server action to log a single validation error.
 * Convenience wrapper around logValidationErrors for single field errors.
 *
 * @param {string} formName - Name of the form where validation failed
 * @param {string} fieldName - Name of the field that failed validation
 * @param {string} errorMessage - The validation error message
 */
export async function logValidationError(formName, fieldName, errorMessage) {
  return logValidationErrors(formName, [
    { field: fieldName, message: errorMessage },
  ]);
}

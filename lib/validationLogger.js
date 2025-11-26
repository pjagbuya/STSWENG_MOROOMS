import {
  logValidationError as serverLogValidationError,
  logValidationErrors as serverLogValidationErrors,
} from '@/app/logger/validation-actions';

/**
 * Client-side validation logger that sends validation errors to the server.
 * Does NOT log actual field values - only field names and error messages.
 *
 * Note: This module is kept for backward compatibility.
 * For new code, prefer using useFormWithLogging hook which handles logging automatically.
 */
const validationLogger = {
  /**
   * Log a single validation error
   * @param {string} formName - Name of the form
   * @param {string} fieldName - Name of the field that failed validation
   * @param {string} errorMessage - The validation error message
   */
  logError: async (formName, fieldName, errorMessage) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Validation Error]', {
        form: formName,
        field: fieldName,
        error: errorMessage,
      });
    }

    // Send to server for logging
    try {
      await serverLogValidationError(formName, fieldName, errorMessage);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[validationLogger] Failed to log error:', err);
      }
    }
  },

  /**
   * Log multiple validation errors at once
   * @param {string} formName - Name of the form
   * @param {object} errors - Object of { fieldName: errorMessage }
   */
  logErrors: async (formName, errors) => {
    const errorArray = Object.entries(errors).map(([field, message]) => ({
      field,
      message: typeof message === 'string' ? message : String(message),
    }));

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Validation Errors - ${formName}]`, errorArray);
    }

    // Send to server for logging
    try {
      await serverLogValidationErrors(formName, errorArray);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[validationLogger] Failed to log errors:', err);
      }
    }
  },
};

export default validationLogger;

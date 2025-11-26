import { APILogger } from '@/utils/logger_actions';

const validationLogger = {
  logError: (formName, fieldName, errorMessage, value = null) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'VALIDATION_ERROR',
      form: formName,
      field: fieldName,
      error: errorMessage,
      // Don't log sensitive values like passwords
      value: fieldName.toLowerCase().includes('password')
        ? '[REDACTED]'
        : value,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Validation Error]', logEntry);
    }

    // Send to your logging service/API
    // fetch('/api/logs', { method: 'POST', body: JSON.stringify(logEntry) });
    APILogger.log(
      'VALIDATION_ERROR',
      'LOG',
      `Input validation ${formName}`,
      null,
      logEntry,
      null,
    );
  },

  logErrors: (formName, errors) => {
    Object.entries(errors).forEach(([field, message]) => {
      validationLogger.logError(formName, field, message);
    });
  },
};

export default validationLogger;

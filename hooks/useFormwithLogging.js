'use client';

import { logValidationErrors } from '@/app/logger/validation-actions';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

/**
 * A wrapper around react-hook-form's useForm that automatically logs
 * validation errors to the server.
 *
 * @param {string} formName - Unique identifier for the form (used in logs)
 * @param {object} options - All standard useForm options (resolver, defaultValues, etc.)
 * @returns {object} - The same return value as useForm, with validation logging built-in
 *
 * @example
 * const form = useFormWithLogging('signup-form', {
 *   resolver: zodResolver(signupSchema),
 *   defaultValues: { email: '', password: '' },
 * });
 */
export function useFormWithLogging(formName, options = {}) {
  const form = useForm(options);
  const previousErrorsRef = useRef({});

  // Watch for validation errors and log them
  useEffect(() => {
    const { errors } = form.formState;

    // Extract current error keys and messages
    const currentErrors = extractErrors(errors);
    const previousErrors = previousErrorsRef.current;

    // Find new errors (errors that weren't in the previous state)
    const newErrors = findNewErrors(currentErrors, previousErrors);

    // Log new validation errors to the server
    if (newErrors.length > 0) {
      // Fire and forget - don't block the UI
      logValidationErrors(formName, newErrors).catch(err => {
        if (process.env.NODE_ENV === 'development') {
          console.error('[useFormWithLogging] Failed to log errors:', err);
        }
      });
    }

    // Update the previous errors reference
    previousErrorsRef.current = currentErrors;
  }, [form.formState.errors, formName]);

  return form;
}

/**
 * Recursively extracts errors from react-hook-form's errors object
 * into a flat object of { fieldPath: message }
 *
 * @param {object} errors - The errors object from formState
 * @param {string} prefix - Current path prefix for nested fields
 * @returns {object} - Flat object mapping field paths to error messages
 */
function extractErrors(errors, prefix = '') {
  const result = {};

  for (const key in errors) {
    const error = errors[key];
    const fieldPath = prefix ? `${prefix}.${key}` : key;

    if (error?.message) {
      // This is a leaf error with a message
      result[fieldPath] = error.message;
    } else if (error && typeof error === 'object') {
      // This might be a nested field or array
      Object.assign(result, extractErrors(error, fieldPath));
    }
  }

  return result;
}

/**
 * Finds errors that are new (not present in previousErrors or have different messages)
 *
 * @param {object} currentErrors - Current errors { fieldPath: message }
 * @param {object} previousErrors - Previous errors { fieldPath: message }
 * @returns {Array<{field: string, message: string}>} - Array of new errors
 */
function findNewErrors(currentErrors, previousErrors) {
  const newErrors = [];

  for (const field in currentErrors) {
    const currentMessage = currentErrors[field];
    const previousMessage = previousErrors[field];

    // Log if this is a new error or the message changed
    if (currentMessage !== previousMessage) {
      newErrors.push({ field, message: currentMessage });
    }
  }

  return newErrors;
}

export default useFormWithLogging;

import { z } from 'zod';

/**
 * Centralized password validation schema
 * Ensures consistent password requirements across the entire application
 *
 * Requirements (2.1.4 & 2.1.5):
 * - Minimum 14 characters
 * - Maximum 32 characters
 * - At least one lowercase letter
 * - At least one uppercase letter
 * - At least one number
 * - At least one special character
 */
export const passwordSchema = z
  .string()
  .min(14, { message: 'Password must be at least 14 characters long.' })
  .max(32, { message: 'Password must not exceed 32 characters.' })
  .regex(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter.',
  })
  .regex(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter.',
  })
  .regex(/(?=.*\d)/, {
    message: 'Password must contain at least one number.',
  })
  .regex(/(?=.*[^A-Za-z0-9])/, {
    message: 'Password must contain at least one special character.',
  });

/**
 * Optional password schema for edit forms where password change is optional
 */
export const optionalPasswordSchema = z.union([
  z.literal(''), // Allow empty string (no password change)
  passwordSchema,
]);

/**
 * Standard text field constraints for 2.3.2 compliance
 * Use these for consistent validation across forms
 */
export const textFieldConstraints = {
  name: {
    min: 2,
    max: 50,
    pattern: /^[a-zA-Z0-9\s\-_.']+$/, // Alphanumeric, spaces, hyphens, underscores, periods, apostrophes
  },
  details: {
    min: 0,
    max: 999,
    pattern: /^[a-zA-Z0-9\s\-_.,!?'"()[\]@#$%&*:;/\\]+$/, // Extended character set for descriptions
  },
  securityAnswer: {
    min: 2,
    max: 100,
  },
};

/**
 * Name field schema with proper constraints
 */
export const nameSchema = z
  .string()
  .min(textFieldConstraints.name.min, {
    message: `Name must be at least ${textFieldConstraints.name.min} characters.`,
  })
  .max(textFieldConstraints.name.max, {
    message: `Name cannot exceed ${textFieldConstraints.name.max} characters.`,
  });

/**
 * Details/description field schema with proper constraints
 */
export const detailsSchema = z
  .string()
  .max(textFieldConstraints.details.max, {
    message: `Details cannot exceed ${textFieldConstraints.details.max} characters.`,
  })
  .optional();

/**
 * Security answer schema with proper constraints
 */
export const securityAnswerSchema = z
  .string()
  .min(textFieldConstraints.securityAnswer.min, {
    message: `Answer must be at least ${textFieldConstraints.securityAnswer.min} characters.`,
  })
  .max(textFieldConstraints.securityAnswer.max, {
    message: `Answer cannot exceed ${textFieldConstraints.securityAnswer.max} characters.`,
  });

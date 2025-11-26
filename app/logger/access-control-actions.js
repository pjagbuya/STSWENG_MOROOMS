'use server';

import { APILogger } from '@/utils/logger_actions';

/**
 * Server action to log access control failures.
 * This should be called from client components when access is denied.
 *
 * @param {object} params - The logging parameters
 * @param {string} params.reason - Reason for the access denial (e.g., 'UNAUTHENTICATED', 'PERMISSION_DENIED', 'ROLE_MISMATCH')
 * @param {string} params.attemptedResource - The resource or route that was attempted to access
 * @param {string|null} params.userId - The user ID (if authenticated)
 * @param {string|null} params.userRole - The user's role (if authenticated)
 * @param {string|null} params.requiredPermission - The permission that was required
 * @param {string|null} params.requiredPermissions - Multiple permissions that were required (comma-separated)
 */
export async function logAccessControlFailure({
  reason,
  attemptedResource,
  userId = null,
  userRole = null,
  requiredPermission = null,
  requiredPermissions = null,
}) {
  try {
    await APILogger.log(
      'ACCESS_CONTROL_FAILURE',
      'ACCESS_CHECK',
      'access_control',
      userId,
      {
        reason,
        attemptedResource,
        userRole,
        requiredPermission,
        requiredPermissions,
      },
      reason, // This will set status to 'error'
    );
  } catch (err) {
    // Don't let logging errors break the application
    if (process.env.NODE_ENV === 'development') {
      console.error('[logAccessControlFailure] Failed to log:', err);
    }
  }
}

/**
 * Server action to log access control failures from middleware.
 * This is a simplified version for use in middleware context.
 *
 * @param {string} reason - Reason code for the failure
 * @param {string} path - The requested path
 * @param {string|null} userId - User ID if available
 * @param {object} additionalData - Any additional context data
 */
export async function logMiddlewareAccessFailure(
  reason,
  path,
  userId = null,
  additionalData = {},
) {
  try {
    await APILogger.log(
      'ACCESS_CONTROL_FAILURE',
      'MIDDLEWARE',
      'access_control',
      userId,
      {
        reason,
        path,
        ...additionalData,
      },
      reason,
    );
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[logMiddlewareAccessFailure] Failed to log:', err);
    }
  }
}

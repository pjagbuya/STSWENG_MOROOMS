'use server';

import {
  RESOURCE_RULES,
  getInternalRole,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from '@/lib/rbac-config';
import { APILogger } from '@/utils/logger_actions';
import { createClient } from '@/utils/supabase/server';

/**
 * Get the current authenticated user with their role for server-side permission checks.
 * This fetches the user from Supabase auth and their role from the database.
 *
 * @returns {Promise<{id: string, email: string, role: string}|null>} User object with role, or null if not authenticated
 */
export async function getCurrentUser() {
  const supabase = createClient();

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    return null;
  }

  // Fetch user role from database
  const { data: role, error: roleError } = await supabase.rpc('get_user_role', {
    p_user_id: authUser.id,
  });

  if (roleError) {
    return {
      id: authUser.id,
      email: authUser.email,
      role: null,
    };
  }

  const internalRole = getInternalRole(role);

  return {
    id: authUser.id,
    email: authUser.email,
    role: internalRole,
  };
}

/**
 * Check if the current user has a specific permission.
 * Logs access control failures to the database.
 *
 * @param {string} permission - The permission to check (from PERMISSIONS enum)
 * @param {string} actionContext - Description of the action being attempted (for logging)
 * @returns {Promise<{authorized: boolean, user: object|null, error: string|null}>}
 */
export async function checkPermission(
  permission,
  actionContext = 'unknown_action',
) {
  const user = await getCurrentUser();

  if (!user) {
    await logAccessControlFailure({
      reason: 'UNAUTHENTICATED',
      actionContext,
      userId: null,
      userRole: null,
      requiredPermission: permission,
    });
    return { authorized: false, user: null, error: 'User not authenticated' };
  }

  if (!user.role) {
    await logAccessControlFailure({
      reason: 'NO_ROLE_ASSIGNED',
      actionContext,
      userId: user.id,
      userRole: null,
      requiredPermission: permission,
    });
    return { authorized: false, user, error: 'User has no role assigned' };
  }

  const hasAccess = hasPermission(user, permission);

  if (!hasAccess) {
    await logAccessControlFailure({
      reason: 'PERMISSION_DENIED',
      actionContext,
      userId: user.id,
      userRole: user.role,
      requiredPermission: permission,
    });
    return { authorized: false, user, error: 'Permission denied' };
  }

  return { authorized: true, user, error: null };
}

/**
 * Check if the current user has any of the specified permissions.
 * Logs access control failures to the database.
 *
 * @param {string[]} permissions - Array of permissions to check
 * @param {string} actionContext - Description of the action being attempted
 * @returns {Promise<{authorized: boolean, user: object|null, error: string|null}>}
 */
export async function checkAnyPermission(
  permissions,
  actionContext = 'unknown_action',
) {
  const user = await getCurrentUser();

  if (!user) {
    await logAccessControlFailure({
      reason: 'UNAUTHENTICATED',
      actionContext,
      userId: null,
      userRole: null,
      requiredPermissions: permissions.join(', '),
    });
    return { authorized: false, user: null, error: 'User not authenticated' };
  }

  if (!user.role) {
    await logAccessControlFailure({
      reason: 'NO_ROLE_ASSIGNED',
      actionContext,
      userId: user.id,
      userRole: null,
      requiredPermissions: permissions.join(', '),
    });
    return { authorized: false, user, error: 'User has no role assigned' };
  }

  const hasAccess = hasAnyPermission(user, permissions);

  if (!hasAccess) {
    await logAccessControlFailure({
      reason: 'PERMISSION_DENIED',
      actionContext,
      userId: user.id,
      userRole: user.role,
      requiredPermissions: permissions.join(', '),
    });
    return { authorized: false, user, error: 'Permission denied' };
  }

  return { authorized: true, user, error: null };
}

/**
 * Check if the current user has all of the specified permissions.
 * Logs access control failures to the database.
 *
 * @param {string[]} permissions - Array of permissions to check
 * @param {string} actionContext - Description of the action being attempted
 * @returns {Promise<{authorized: boolean, user: object|null, error: string|null}>}
 */
export async function checkAllPermissions(
  permissions,
  actionContext = 'unknown_action',
) {
  const user = await getCurrentUser();

  if (!user) {
    await logAccessControlFailure({
      reason: 'UNAUTHENTICATED',
      actionContext,
      userId: null,
      userRole: null,
      requiredPermissions: permissions.join(', '),
    });
    return { authorized: false, user: null, error: 'User not authenticated' };
  }

  if (!user.role) {
    await logAccessControlFailure({
      reason: 'NO_ROLE_ASSIGNED',
      actionContext,
      userId: user.id,
      userRole: null,
      requiredPermissions: permissions.join(', '),
    });
    return { authorized: false, user, error: 'User has no role assigned' };
  }

  const hasAccess = hasAllPermissions(user, permissions);

  if (!hasAccess) {
    await logAccessControlFailure({
      reason: 'PERMISSION_DENIED',
      actionContext,
      userId: user.id,
      userRole: user.role,
      requiredPermissions: permissions.join(', '),
    });
    return { authorized: false, user, error: 'Permission denied' };
  }

  return { authorized: true, user, error: null };
}

/**
 * Check resource-level permission (e.g., can user update THIS specific reservation?)
 * Logs access control failures to the database.
 *
 * @param {string} ruleName - Name of the rule from RESOURCE_RULES (e.g., 'canUpdateReservation')
 * @param {any[]} ruleArgs - Arguments to pass to the rule function (after user)
 * @param {string} actionContext - Description of the action being attempted
 * @returns {Promise<{authorized: boolean, user: object|null, error: string|null}>}
 */
export async function checkResourceRule(
  ruleName,
  ruleArgs = [],
  actionContext = 'unknown_action',
) {
  const user = await getCurrentUser();

  if (!user) {
    await logAccessControlFailure({
      reason: 'UNAUTHENTICATED',
      actionContext,
      userId: null,
      userRole: null,
      resourceRule: ruleName,
    });
    return { authorized: false, user: null, error: 'User not authenticated' };
  }

  if (!user.role) {
    await logAccessControlFailure({
      reason: 'NO_ROLE_ASSIGNED',
      actionContext,
      userId: user.id,
      userRole: null,
      resourceRule: ruleName,
    });
    return { authorized: false, user, error: 'User has no role assigned' };
  }

  const rule = RESOURCE_RULES[ruleName];
  if (!rule) {
    console.error(`[checkResourceRule] Unknown rule: ${ruleName}`);
    return {
      authorized: false,
      user,
      error: `Unknown resource rule: ${ruleName}`,
    };
  }

  const hasAccess = rule(user, ...ruleArgs);

  if (!hasAccess) {
    await logAccessControlFailure({
      reason: 'RESOURCE_ACCESS_DENIED',
      actionContext,
      userId: user.id,
      userRole: user.role,
      resourceRule: ruleName,
      resourceArgs: ruleArgs,
    });
    return { authorized: false, user, error: 'Resource access denied' };
  }

  return { authorized: true, user, error: null };
}

/**
 * Helper to require a permission and throw if not authorized.
 * Use this for cleaner code when you want to abort the action early.
 *
 * @param {string} permission - The permission to check
 * @param {string} actionContext - Description of the action being attempted
 * @throws {Error} If not authorized
 * @returns {Promise<object>} The authenticated user
 */
export async function requirePermission(
  permission,
  actionContext = 'unknown_action',
) {
  const { authorized, user, error } = await checkPermission(
    permission,
    actionContext,
  );

  if (!authorized) {
    throw new Error(error || 'Unauthorized');
  }

  return user;
}

/**
 * Helper to require any of the permissions and throw if not authorized.
 *
 * @param {string[]} permissions - Array of permissions to check
 * @param {string} actionContext - Description of the action being attempted
 * @throws {Error} If not authorized
 * @returns {Promise<object>} The authenticated user
 */
export async function requireAnyPermission(
  permissions,
  actionContext = 'unknown_action',
) {
  const { authorized, user, error } = await checkAnyPermission(
    permissions,
    actionContext,
  );

  if (!authorized) {
    throw new Error(error || 'Unauthorized');
  }

  return user;
}

/**
 * Helper to require all of the permissions and throw if not authorized.
 *
 * @param {string[]} permissions - Array of permissions to check
 * @param {string} actionContext - Description of the action being attempted
 * @throws {Error} If not authorized
 * @returns {Promise<object>} The authenticated user
 */
export async function requireAllPermissions(
  permissions,
  actionContext = 'unknown_action',
) {
  const { authorized, user, error } = await checkAllPermissions(
    permissions,
    actionContext,
  );

  if (!authorized) {
    throw new Error(error || 'Unauthorized');
  }

  return user;
}

/**
 * Internal helper to log access control failures.
 */
async function logAccessControlFailure({
  reason,
  actionContext,
  userId = null,
  userRole = null,
  requiredPermission = null,
  requiredPermissions = null,
  resourceRule = null,
  resourceArgs = null,
}) {
  try {
    await APILogger.log(
      'ACCESS_CONTROL_FAILURE',
      'PERMISSION_CHECK',
      'access_control',
      userId,
      {
        reason,
        actionContext,
        userRole,
        requiredPermission,
        requiredPermissions,
        resourceRule,
        resourceArgs: resourceArgs ? JSON.stringify(resourceArgs) : null,
      },
      reason, // This will set status to 'error'
    );
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[logAccessControlFailure] Failed to log:', err);
    }
  }
}

/**
 * Log a page-level access control failure.
 * Use this in server components before redirecting unauthorized users.
 *
 * @param {string} pagePath - The page path being accessed
 * @param {object|null} user - The user object (from getUserWithRoleServerSide)
 * @param {string|null} requiredPermission - Single required permission
 * @param {string[]|null} requiredPermissions - Array of required permissions
 * @param {string} reason - Reason for failure (UNAUTHENTICATED, PERMISSION_DENIED)
 */
export async function logPageAccessFailure({
  pagePath,
  user = null,
  requiredPermission = null,
  requiredPermissions = null,
  reason = 'PERMISSION_DENIED',
}) {
  try {
    await APILogger.log(
      'ACCESS_CONTROL_FAILURE',
      'PAGE_ACCESS',
      'access_control',
      user?.id || null,
      {
        reason,
        pagePath,
        userRole: user?.role || null,
        requiredPermission,
        requiredPermissions: requiredPermissions
          ? requiredPermissions.join(', ')
          : null,
      },
      reason,
    );
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[logPageAccessFailure] Failed to log:', err);
    }
  }
}

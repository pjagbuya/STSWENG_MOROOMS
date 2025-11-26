'use client';

// AuthComponents.js - Next.js Client Components
import { useAuth } from './authprovider';
import { logAccessControlFailure } from '@/app/logger/access-control-actions';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

/**
 * Component that renders children only if user has the required permission
 * Usage: <Can permission={PERMISSIONS.USER_CREATE}>...</Can>
 */
export function Can({
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  children,
}) {
  const { can, canAny, canAll, isAuthenticated } = useAuth();

  // If not authenticated, don't show anything
  if (!isAuthenticated && !fallback) {
    return null;
  }

  let hasAccess = false;

  if (permission) {
    hasAccess = can(permission);
  } else if (permissions) {
    hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
  }

  return hasAccess ? <>{children}</> : fallback;
}

/**
 * Component that renders children only if user does NOT have the permission
 * Usage: <Cannot permission={PERMISSIONS.USER_DELETE}>...</Cannot>
 */
export function Cannot({ permission, children }) {
  const { can } = useAuth();
  return !can(permission) ? <>{children}</> : null;
}

/**
 * Protected component wrapper - redirects if no permission
 * Usage: <ProtectedContent permission={PERMISSIONS.USER_READ}>...</ProtectedContent>
 */
export function ProtectedContent({
  permission,
  permissions,
  requireAll = false,
  redirectTo = '/unauthorized',
  children,
}) {
  const { isAuthenticated, can, canAny, canAll, loading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (loading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      // Log unauthenticated access attempt
      logAccessControlFailure({
        reason: 'UNAUTHENTICATED',
        attemptedResource: pathname,
        userId: null,
        userRole: null,
        requiredPermission: permission || null,
        requiredPermissions: permissions ? permissions.join(', ') : null,
      });
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }

    // Check permissions
    let hasAccess = true;

    if (permission) {
      hasAccess = can(permission);
    } else if (permissions) {
      hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
    }

    // Redirect if no access
    if (!hasAccess) {
      // Log permission denied
      logAccessControlFailure({
        reason: 'PERMISSION_DENIED',
        attemptedResource: pathname,
        userId: user?.id || null,
        userRole: user?.role || null,
        requiredPermission: permission || null,
        requiredPermissions: permissions ? permissions.join(', ') : null,
      });
      router.push(redirectTo);
    }
  }, [
    loading,
    isAuthenticated,
    permission,
    permissions,
    requireAll,
    can,
    canAny,
    canAll,
    router,
    redirectTo,
    user,
    pathname,
  ]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render until we've checked authentication
  if (!isAuthenticated) {
    return null;
  }

  // Check permissions
  let hasAccess = true;

  if (permission) {
    hasAccess = can(permission);
  } else if (permissions) {
    hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
  }

  // Don't render if no access
  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Higher-Order Component for protecting components
 * Usage: const ProtectedComponent = withAuth(MyComponent, PERMISSIONS.USER_READ);
 */
export function withAuth(
  Component,
  permission,
  permissions,
  requireAll = false,
) {
  return function AuthenticatedComponent(props) {
    const { can, canAny, canAll, isAuthenticated, user } = useAuth();
    const pathname = usePathname();
    const hasLoggedRef = React.useRef(false);

    // Log access failures once
    React.useEffect(() => {
      if (hasLoggedRef.current) return;

      if (!isAuthenticated) {
        hasLoggedRef.current = true;
        logAccessControlFailure({
          reason: 'UNAUTHENTICATED',
          attemptedResource: pathname,
          userId: null,
          userRole: null,
          requiredPermission: permission || null,
          requiredPermissions: permissions ? permissions.join(', ') : null,
        });
      } else {
        let hasAccess = false;
        if (permission) {
          hasAccess = can(permission);
        } else if (permissions) {
          hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
        } else {
          hasAccess = true;
        }
        if (!hasAccess) {
          hasLoggedRef.current = true;
          logAccessControlFailure({
            reason: 'PERMISSION_DENIED',
            attemptedResource: pathname,
            userId: user?.id || null,
            userRole: user?.role || null,
            requiredPermission: permission || null,
            requiredPermissions: permissions ? permissions.join(', ') : null,
          });
        }
      }
    }, [isAuthenticated, can, canAny, canAll, user, pathname]);

    if (!isAuthenticated) {
      return (
        <div className="rounded border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-yellow-800">
            You must be logged in to access this component.
          </p>
        </div>
      );
    }

    let hasAccess = false;

    if (permission) {
      hasAccess = can(permission);
    } else if (permissions) {
      hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
    } else {
      hasAccess = true;
    }

    if (!hasAccess) {
      return (
        <div className="rounded border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">
            You don't have permission to access this component.
          </p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

/**
 * Component that renders different content based on user role
 * Usage:
 * <RoleSwitch
 *   ADMIN={<AdminView />}
 *   ROOM_MANAGER={<RMView />}
 *   USER={<UserView />}
 *   default={<DefaultView />}
 * />
 */
export function RoleSwitch({ default: defaultComponent, ...roleComponents }) {
  const { user } = useAuth();

  if (!user || !user.role) {
    return defaultComponent || null;
  }

  const component = roleComponents[user.role];
  return component || defaultComponent || null;
}

/**
 * Show different content for authenticated vs unauthenticated users
 */
export function AuthSwitch({ authenticated, unauthenticated }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? authenticated : unauthenticated;
}

/**
 * Component that shows loading state while checking permissions
 */
export function PermissionGuard({
  permission,
  permissions,
  requireAll = false,
  loading: loadingComponent = <div>Loading...</div>,
  unauthorized: unauthorizedComponent = <div>Unauthorized</div>,
  children,
}) {
  const { loading, can, canAny, canAll, isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const hasLoggedRef = React.useRef(false);

  // Log access failures once
  React.useEffect(() => {
    if (loading || hasLoggedRef.current) return;

    if (!isAuthenticated) {
      hasLoggedRef.current = true;
      logAccessControlFailure({
        reason: 'UNAUTHENTICATED',
        attemptedResource: pathname,
        userId: null,
        userRole: null,
        requiredPermission: permission || null,
        requiredPermissions: permissions ? permissions.join(', ') : null,
      });
      return;
    }

    let hasAccess = false;
    if (permission) {
      hasAccess = can(permission);
    } else if (permissions) {
      hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
    }

    if (!hasAccess) {
      hasLoggedRef.current = true;
      logAccessControlFailure({
        reason: 'PERMISSION_DENIED',
        attemptedResource: pathname,
        userId: user?.id || null,
        userRole: user?.role || null,
        requiredPermission: permission || null,
        requiredPermissions: permissions ? permissions.join(', ') : null,
      });
    }
  }, [
    loading,
    isAuthenticated,
    can,
    canAny,
    canAll,
    user,
    pathname,
    permission,
    permissions,
    requireAll,
  ]);

  if (loading) {
    return loadingComponent;
  }

  if (!isAuthenticated) {
    return unauthorizedComponent;
  }

  let hasAccess = false;

  if (permission) {
    hasAccess = can(permission);
  } else if (permissions) {
    hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
  }

  if (!hasAccess) {
    return unauthorizedComponent;
  }

  return <>{children}</>;
}

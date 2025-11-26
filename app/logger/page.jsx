import Header from '@/components/header';
import LoggerPage from '@/components/logger/logger_dashboard';
import { PERMISSIONS, hasPermission } from '@/lib/rbac-config';
import { logPageAccessFailure } from '@/lib/server-rbac';
import { getUserWithRoleServerSide } from '@/utils/utils';
import { redirect } from 'next/navigation';

export default async function LoggerRoute() {
  // Server-side permission check
  const userWithRole = await getUserWithRoleServerSide();

  if (!userWithRole) {
    await logPageAccessFailure({
      pagePath: '/logger',
      user: null,
      requiredPermission: PERMISSIONS.LOGS_VIEW,
      reason: 'UNAUTHENTICATED',
    });
    redirect('/login');
  }

  const hasAccess = hasPermission(userWithRole, PERMISSIONS.LOGS_VIEW);

  if (!hasAccess) {
    await logPageAccessFailure({
      pagePath: '/logger',
      user: userWithRole,
      requiredPermission: PERMISSIONS.LOGS_VIEW,
      reason: 'PERMISSION_DENIED',
    });
    redirect('/unauthorized');
  }

  return (
    <>
      <Header />
      <LoggerPage />
    </>
  );
}

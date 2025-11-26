import {
  getApproveTypes,
  getRoleRequests,
  getRoles,
  getRolesWithPermission,
  getUsers,
  getUsersWithProof,
} from './actions';
import { RoleTable } from './role_table';
import { UpgradeRoleUserTable } from './upgrade_role_user_table';
import { UserTable } from './user_table';
import { VerifyUserTable } from './verify_user_table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PERMISSIONS, hasAnyPermission } from '@/lib/rbac-config';
import { logPageAccessFailure } from '@/lib/server-rbac';
import { getUserWithRoleServerSide } from '@/utils/utils';
import { redirect } from 'next/navigation';
import React from 'react';

const Management = async () => {
  // Server-side permission check
  const userWithRole = await getUserWithRoleServerSide();

  const requiredPermissions = [
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.USER_ROLE_UPDATE,
    PERMISSIONS.ROLE_REQUEST_APPROVE,
    PERMISSIONS.ROLE_CREATE,
    PERMISSIONS.ROLE_DELETE,
  ];

  if (!userWithRole) {
    await logPageAccessFailure({
      pagePath: '/users/[user_id]/home/admin/users',
      user: null,
      requiredPermissions,
      reason: 'UNAUTHENTICATED',
    });
    redirect('/login');
  }

  const hasAccess = hasAnyPermission(userWithRole, requiredPermissions);

  if (!hasAccess) {
    await logPageAccessFailure({
      pagePath: '/users/[user_id]/home/admin/users',
      user: userWithRole,
      requiredPermissions,
      reason: 'PERMISSION_DENIED',
    });
    redirect('/unauthorized');
  }

  const users = await getUsers();
  const roles = await getRoles();
  const rolesWithPermission = await getRolesWithPermission();
  const approveTypes = await getApproveTypes();
  const roleRequests = await getRoleRequests();
  const usersWithProof = await getUsersWithProof();

  return (
    <div className="flex w-full flex-col gap-2 p-8">
      <h1 className="text-3xl font-bold">User Management</h1>
      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="role_settings">Role Settings</TabsTrigger>
          <TabsTrigger value="verify_user">Verify User</TabsTrigger>
          <TabsTrigger value="role_request">Role Request</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UserTable data={users} roles={roles} />
        </TabsContent>
        <TabsContent value="role_settings">
          <RoleTable data={rolesWithPermission} roles={roles} />
        </TabsContent>
        <TabsContent value="verify_user">
          <VerifyUserTable data={usersWithProof} approveTypes={approveTypes} />
        </TabsContent>
        <TabsContent value="role_request">
          <UpgradeRoleUserTable data={roleRequests} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Management;

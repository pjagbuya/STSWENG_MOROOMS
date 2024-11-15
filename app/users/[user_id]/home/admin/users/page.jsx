import { getRoles, getRolesWithPermission, getUsers } from './actions';
import { RoleTable } from './role_table';
import { UserTable } from './user_table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';

const Management = async () => {
  const users = await getUsers();
  const roles = await getRoles();
  const rolesWithPermission = await getRolesWithPermission();
  console.log(users, roles);
  return (
    <div className="flex w-full flex-col gap-2 p-8">
      <h1 className="text-3xl font-bold">Reservation Rooms</h1>
      <h3 className="text-base font-light">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
        laoreet, metus nec.
      </h3>
      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="role_settings">Role Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UserTable data={users} roles={roles} />
        </TabsContent>
        <TabsContent value="role_settings">
          <RoleTable data={rolesWithPermission} roles={roles} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Management;

'use client';

import { Combobox } from './role-combobox';
import { UserRoleChangePopup } from './user_role_change_popup';
import { requestRoleUpgrade } from '@/app/users/[user_id]/profile/rolerequest/action';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@radix-ui/react-dropdown-menu';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function RoleUpgradeForm({ roles, currentRole, userId }) {
  const [rowData, setRowData] = useState(null);
  const [openRoleChangePopup, setOpenRoleChangePopup] = useState(false);
  const url = 'users/[user_id]/profile/rolerequest';
  return (
    <div>
      <Card className="mx-auto w-[425px] max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Request Role Upgrade</CardTitle>
          <CardDescription>
            Fill out the following details. Click submit once done.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full flex-col">
            <Label>Role</Label>
            <Combobox
              className="w-full"
              data={roles}
              currentValue={currentRole}
              onSelect={roleIndex => {
                setRowData({ roleIndex });
                setOpenRoleChangePopup(true);
              }}
            />
          </div>
        </CardContent>
      </Card>
      <UserRoleChangePopup
        title={'Reqiest Role Upgrade?'}
        body={'Are you sure you want to request this role upgrade?'}
        open={openRoleChangePopup}
        onCancel={() => {
          setRowData(null);
          setOpenRoleChangePopup(false);
        }}
        onAction={() => {
          const action = async () => {
            console.log(userId);
            console.log(roles[rowData.roleIndex].id);
            // await updateUserRole(
            //   data[rowData.index].userId,
            //   roles[rowData.roleIndex].value,
            //   url,
            // );
            await requestRoleUpgrade(userId, roles[rowData.roleIndex].id, url);
            setRowData(null);
            setOpenRoleChangePopup(false);
          };

          action();
        }}
      />
    </div>
  );
}

'use client';

import ActionDropdown from '@/components/action-dropdown';
import { RoleCombobox } from '@/components/role-combobox';

export const columns = [
  {
    accessorKey: 'roleList',
    id: 'role',
    header: 'Roles',
    enableHiding: false,
    cell: ({ row }) => {
      return <RoleCombobox data={row.original.roleList} />;
    },
  },
  {
    accessorKey: 'userFirstname',
    header: 'First name',
  },
  {
    accessorKey: 'userLastname',
    header: 'Last name',
  },
  {
    accessorKey: 'roleName',
    header: 'Role',
  },
  {
    accessorKey: 'userSchoolId',
    header: 'School Id',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      // Check if row has userId before accessing
      const userId = row.getValue ? row.getValue('userId') : null;
      return <ActionDropdown url={`home/admin/users/${userId}`} />;
    },
  },
];

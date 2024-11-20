'use client';

export const columns = [
  {
    accessorKey: 'userFirstname',
    header: 'First name',
  },
  {
    accessorKey: 'userLastname',
    header: 'Last name',
  },
];

export const roleColumns = [
  {
    accessorKey: 'roleName',
    header: 'Role name',
  },
  {
    accessorKey: 'maxDuration',
    header: 'max Duration (hour)',
  },
  {
    accessorKey: 'maxNumber',
    header: 'Max Capacity',
  },
];

export const upgradeUserRequestColumns = [
  {
    accessorKey: 'userFirstname',
    header: 'First name',
  },
  {
    accessorKey: 'userLastname',
    header: 'Last name',
  },
  {
    accessorKey: 'currentRoleName',
    header: 'Current Role Name',
  },
  {
    accessorKey: 'requestedRoleName',
    header: 'Requested Role Name',
  },
];

'use client';

export function fetchData() {
  return { name: 'John Doe' };
}

export const columns = [
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
  // {
  //   id: 'actions',
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     // Check if row has userId before accessing
  //     const userId = row.getValue ? row.getValue('userId') : null;
  //     return <ActionDropdown url={`home/admin/users/${userId}`} />;
  //   },
  // },
];

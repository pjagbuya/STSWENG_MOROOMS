import ActionDropdown from '@/components/util/action_dropdown';

export const userColumns = [
  {
    accessorKey: 'userFirstname',
    header: 'User Firstname',
  },
  {
    accessorKey: 'userLastname',
    header: 'User Lastname',
  },
  {
    accessorKey: 'userRole',
    header: 'User Role',
  },
  {
    accessorKey: 'userSchoolId',
    header: 'User School Id',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return <ActionDropdown />;
    },
  },
];

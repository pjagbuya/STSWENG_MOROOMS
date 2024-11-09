import { RoleCombobox } from '../role-combobox';

export function addCombobox(columns, onSelect) {
  return [
    {
      accessorKey: 'roleList',
      id: 'role',
      header: 'Roles',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <RoleCombobox className={'-mr-8'} data={row.original.roleList} />
        );
      },
    },
    ...columns,
  ];
}

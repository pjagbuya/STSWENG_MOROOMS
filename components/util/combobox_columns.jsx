import { Combobox } from '../role-combobox';

export function addCombobox(columns, data, onSelect) {
  return [
    {
      accessorKey: 'roleList',
      id: 'role',
      header: 'Roles',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Combobox
            data={data}
            currentValue={row.original.roleName}
            onSelect={onSelect.bind(null, row.id)}
          />
        );
      },
    },
    ...columns,
  ];
}

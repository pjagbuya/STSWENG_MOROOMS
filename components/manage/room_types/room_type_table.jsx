'use client';

import ActionDropdown from '@/components/action-dropdown';
import { DataTable } from '@/components/data-table';
import { SortableHeader } from '@/components/data_table';

const COLUMNS = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <SortableHeader column={column}>Name</SortableHeader>
    ),
  },
  {
    accessorKey: 'details',
    header: 'Details',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return <ActionDropdown />;
    },
  },
];

export default function RoomTypeTable({ data }) {
  return (
    <>
      <DataTable columns={COLUMNS} data={data} />
    </>
  );
}

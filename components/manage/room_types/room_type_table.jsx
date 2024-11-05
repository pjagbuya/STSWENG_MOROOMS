'use client';

import { addActionColumn } from '@/components/util/action_dropdown';
import { DataTable } from '@/components/util/data_table';
import { SortableHeader } from '@/components/util/sortable_header';

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
];

export default function RoomTypeTable({ data }) {
  const finalColumns = addActionColumn(
    COLUMNS,
    () => {},
    () => {},
  );

  return (
    <>
      <DataTable columns={finalColumns} data={data} />
    </>
  );
}

'use client';

import { DataTable, SortableHeader } from '@/components/data_table';

const COLUMNS = [
  {
    accessorKey: 'event_name',
    header: ({ column }) => (
      <SortableHeader column={column}>Name</SortableHeader>
    ),
  },
  {
    accessorKey: 'event_date',
    header: () => 'Details',
  },
];

export default function RoomTypeTable() {
  return (
    <>
      <DataTable className="border-2" columns={COLUMNS} data={[]} />
    </>
  );
}

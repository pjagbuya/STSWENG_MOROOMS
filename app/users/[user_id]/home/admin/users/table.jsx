'use client';

import { DataTable } from '@/components/data-table';

export default function UserDataTable({ columns, data }) {
  return <DataTable columns={columns} data={data} />;
}

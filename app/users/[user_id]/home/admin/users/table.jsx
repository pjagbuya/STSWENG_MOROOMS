'use client';

import { DataTable } from '@/components/util/data_table';

export default function UserDataTable({ columns, data }) {
  return <DataTable columns={columns} data={data} />;
}

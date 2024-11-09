'use client';

import { addActionColumn } from '@/components/util/action_dropdown';
import { addCombobox } from '@/components/util/combobox_columns';
import { DataTable } from '@/components/util/data_table';

export default function UserDataTable({ columns, data }) {
  const finalColumns = addCombobox(
    addActionColumn(
      columns,
      () => {},
      () => {},
    ),

    () => {},
  );

  console.log(finalColumns);
  return <DataTable columns={finalColumns} data={data} />;
}

'use client';

import { updateUserRole } from './actions';
import { columns } from './columns';
import { UserRoleChangePopup } from '@/components/user_role_change_popup';
import { addActionColumn } from '@/components/util/action_dropdown';
import { addCombobox } from '@/components/util/combobox_columns';
import { DataTable } from '@/components/util/data_table';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function UserTable({ data, roles }) {
  const [rowData, setRowData] = useState(null);
  const url = usePathname();
  console.log(url);
  let finalColumns = addCombobox(
    addActionColumn(
      columns,
      () => {},
      () => {},
    ),
    roles,
    (roleIndex, index) => {
      setRowData({ index, roleIndex });
    },
  );

  return (
    <div>
      <DataTable columns={finalColumns} data={data} />
      <UserRoleChangePopup
        open={rowData != null}
        onCancel={() => {
          setRowData(null);
        }}
        onAction={() => {
          const action = async () => {
            await updateUserRole(
              data[rowData.index].userId,
              roles[rowData.roleIndex].value,
              url,
            );
            setRowData(null);
          };

          action();
        }}
        onOpenChange={v => {
          // setOpenDeleteDialog(v);
        }}
      />
    </div>
  );
}

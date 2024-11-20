'use client';

import { updateUserRole } from './actions';
import { UserRoleChangePopup } from '@/components/user_role_change_popup';
import { addActionColumn } from '@/components/util/action_dropdown';
import { addCombobox } from '@/components/util/combobox_columns';
import { DataTable } from '@/components/util/data_table';
import { useState } from 'react';

export default function UserDataTable({ columns, data }) {
  const [userRoleChangeIndex, setUserRoleChangeIndex] = useState(null);
  const finalColumns = addCombobox(
    addActionColumn(
      columns,
      () => {},
      () => {},
    ),

    index => {
      setUserRoleChangeIndex(index);
    },
  );

  return (
    <div>
      <DataTable columns={finalColumns} data={data} />
      <UserRoleChangePopup
        open={userRoleChangeIndex != null}
        onCancel={() => {
          setUserRoleChangeIndex(null);
        }}
        onAction={() => updateUserRole()}
        onOpenChange={v => {
          // setOpenDeleteDialog(v);
        }}
      />
    </div>
  );
}

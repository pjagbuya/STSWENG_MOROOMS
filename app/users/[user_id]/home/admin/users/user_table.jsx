'use client';

import { updateUserInfo, updateUserRole } from './actions';
import { columns } from './columns';
import { userEditFormSchema } from './form_schema';
import EditPopup from '@/components/edit_popup';
import { UserRoleChangePopup } from '@/components/user_role_change_popup';
import { addActionColumn } from '@/components/util/action_dropdown';
import { addCombobox } from '@/components/util/combobox_columns';
import { DataTable } from '@/components/util/data_table';
import { objectToFormData } from '@/utils/server_utils';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

function setPopup(row, setRowData, setOpenPopup) {
  setRowData(row);
  setOpenPopup(true);
}

export function UserTable({ data, roles }) {
  const [rowData, setRowData] = useState(null);
  const [openRoleChangePopup, setOpenRoleChangePopup] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const url = usePathname();

  let finalColumns = addCombobox(
    addActionColumn(
      columns,
      row => {
        console.log('Edit', row.original);
        setPopup(row.original, setRowData, setOpenDeletePopup);
      },
      row => {
        setPopup(row.original, setRowData, setOpenEditPopup);
      },
    ),
    roles,
    (roleIndex, index) => {
      setRowData({ index, roleIndex });
      setOpenRoleChangePopup(true);
    },
  );

  return (
    <div>
      <DataTable columns={finalColumns} data={data} />
      <UserRoleChangePopup
        open={openRoleChangePopup}
        onCancel={() => {
          setRowData(null);
          setOpenRoleChangePopup(false);
        }}
        onAction={() => {
          const action = async () => {
            await updateUserRole(
              data[rowData.index].userId,
              roles[rowData.roleIndex].value,
              url,
            );
            setRowData(null);
            setOpenRoleChangePopup(false);
          };

          action();
        }}
        onOpenChange={v => {
          // setOpenDeleteDialog(v);
        }}
      />
      <EditPopup
        formSchema={userEditFormSchema}
        title={'Edit User Data'}
        row={rowData}
        open={openEditPopup}
        onEdit={async (row, form, values) => {
          console.log('row', row);
          console.log('form', form);
          console.log('values', values);
          await updateUserInfo(row.userId, url, await objectToFormData(values));
          setRowData(null);
          setOpenEditPopup(false);
        }}
        onOpenChange={v => {
          setOpenEditPopup(v);

          if (!v) {
            setRowData(null);
          }
        }}
      />
    </div>
  );
}

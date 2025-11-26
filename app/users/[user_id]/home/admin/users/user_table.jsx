'use client';

import { deleteUser, updateUserInfo, updateUserRole } from './actions';
import { columns } from './columns';
import { userEditFormSchema } from './form_schema';
import { DeletePopup } from '@/components/delete_popup';
import EditPopup from '@/components/edit_popup';
import { UserRoleChangePopup } from '@/components/user_role_change_popup';
import { addActionColumn } from '@/components/util/action_dropdown';
import { addCombobox } from '@/components/util/combobox_columns';
import { DataTable } from '@/components/util/data_table';
import { objectToFormData } from '@/utils/server_utils';
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
  const url = '/users/[user_id]/home/admin/users';

  let finalColumns = addCombobox(
    addActionColumn(
      columns,
      row => {
        // console.log('Edit', row.original);
        setPopup(row.original, setRowData, setOpenDeletePopup);
      },
      row => {
        setPopup(row.original, setRowData, setOpenEditPopup);
      },
    ),
    roles,
    (index, roleIndex) => {
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
            // console.log(url);
          };

          action();
        }}
      />
      <EditPopup
        formSchema={userEditFormSchema}
        title={'Edit User Data'}
        row={rowData}
        open={openEditPopup}
        onEdit={async (row, form, values) => {
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

      <DeletePopup
        title={'delete user'}
        body={'Do you want to delete this user'}
        open={openDeletePopup}
        onCancel={() => {
          setRowData(null);
          setOpenDeletePopup(false);
        }}
        onDelete={() => {
          const action = async () => {
            await deleteUser(rowData.userId, url);
            setRowData(null);
            setOpenDeletePopup(false);
          };

          action();
        }}
        onOpenChange={v => {
          setOpenDeletePopup(v);

          if (!v) {
            setRowData(null);
          }
        }}
      />
    </div>
  );
}

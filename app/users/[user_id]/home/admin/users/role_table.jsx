'use client';

import { deleteUser, updateRole, updateUserInfo } from './actions';
import { roleColumns } from './columns';
import { roleEditFormSchema, userEditFormSchema } from './form_schema';
import { DeletePopup } from '@/components/delete_popup';
import EditPopup from '@/components/edit_popup';
import { addActionColumn } from '@/components/util/action_dropdown';
import { DataTable } from '@/components/util/data_table';
import { objectToFormData } from '@/utils/server_utils';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

function setPopup(row, setRowData, setOpenPopup) {
  setRowData(row);
  setOpenPopup(true);
}

export function RoleTable({ data }) {
  const [rowData, setRowData] = useState(null);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const url = usePathname();
  console.log('role data', data);

  let finalColumns = addActionColumn(
    roleColumns,
    row => {
      setPopup(row.original, setRowData, setOpenDeletePopup);
    },
    row => {
      console.log('what:', row.original);
      setPopup(row.original, setRowData, setOpenEditPopup);
    },
  );

  return (
    <div>
      <DataTable columns={finalColumns} data={data} />
      <EditPopup
        formSchema={roleEditFormSchema}
        title={'Edit User Data'}
        row={rowData}
        open={openEditPopup}
        onEdit={async (row, form, values) => {
          await updateRole(row.roleId, url, await objectToFormData(values));
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
        title={'delete role'}
        body={'Do you want to delete this role'}
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

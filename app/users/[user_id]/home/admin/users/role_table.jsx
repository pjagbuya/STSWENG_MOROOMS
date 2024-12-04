'use client';

import { addRole, deleteRole, updateRole } from './actions';
import { roleColumns } from './columns';
import { roleFormSchema } from './form_schema';
import { AddPopup } from '@/components/add_popup';
import { DeletePopup } from '@/components/delete_popup';
import EditPopup from '@/components/edit_popup';
import { Button } from '@/components/ui/button';
import { addActionColumn } from '@/components/util/action_dropdown';
import { DataTable } from '@/components/util/data_table';
import { objectToFormData } from '@/utils/server_utils';
import { useState } from 'react';

function setPopup(row, setRowData, setOpenPopup) {
  setRowData(row);
  setOpenPopup(true);
}

export function RoleTable({ data }) {
  const [rowData, setRowData] = useState(null);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [openAddPopup, setOpenAddPopup] = useState(false);
  const url = '/users/[user_id]/home/admin/users';

  let finalColumns = addActionColumn(
    roleColumns,
    row => {
      setPopup(row.original, setRowData, setOpenDeletePopup);
    },
    row => {
      setPopup(row.original, setRowData, setOpenEditPopup);
    },
  );

  return (
    <div>
      <DataTable columns={finalColumns} data={data} />
      <EditPopup
        formSchema={roleFormSchema}
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
            await deleteRole(rowData.roleId, url);
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

      <AddPopup
        formSchema={roleFormSchema}
        title={'Add role'}
        open={openAddPopup}
        onAdd={async (form, values) => {
          await addRole(url, await objectToFormData(values));
          setOpenAddPopup(false);
        }}
        onOpenChange={v => {
          setOpenAddPopup(v);
        }}
      />
      <Button
        onClick={() => setOpenAddPopup(true)}
        className={'mt-4 w-full'}
        variant="secondary"
      >
        Add Role
      </Button>
    </div>
  );
}

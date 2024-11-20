'use client';

import RoomSetDeletePopup from './room_set_delete_popup';
import RoomSetEditPopup from './room_set_edit_popup';
import {
  deleteRoomSetAction,
  editRoomSetAction,
} from '@/app/manage/room_sets/actions';
import { addActionColumn } from '@/components/util/action_dropdown';
import { DataTable } from '@/components/util/data_table';
import { SortableHeader } from '@/components/util/sortable_header';
import { useState } from 'react';

const COLUMNS = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <SortableHeader column={column}>Name</SortableHeader>
    ),
  },
];

export default function RoomSetTable({ data }) {
  const [row, setRow] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const finalColumns = addActionColumn(
    COLUMNS,
    handleDeletePrompt,
    handleEditPrompt,
  );

  function handleDeletePrompt(row) {
    setRow(row);
    setOpenDeleteDialog(true);
  }

  async function handleDeleteContinue() {
    await deleteRoomSetAction(row.original.id);
    setRow(null);
  }

  function handleEditPrompt(row) {
    setRow(row);
    setOpenEditDialog(true);
  }

  async function handleEditContinue(row, form, values) {
    const err = await editRoomSetAction(row.original.id, values.name);

    if (err) {
      form.setError('event_name', err);
      return;
    }

    setOpenEditDialog(false);
    setRow(null);
  }

  return (
    <>
      <DataTable columns={finalColumns} data={data} />

      <RoomSetDeletePopup
        open={openDeleteDialog}
        onCancel={() => {
          setRow(null);
          setOpenDeleteDialog(false);
        }}
        onDelete={handleDeleteContinue}
        onOpenChange={v => {
          setOpenDeleteDialog(v);

          if (!v) {
            setRow(null);
          }
        }}
      />

      <RoomSetEditPopup
        row={row}
        open={openEditDialog}
        onEdit={handleEditContinue}
        onOpenChange={v => {
          setOpenEditDialog(v);

          if (!v) {
            setRow(null);
          }
        }}
      />
    </>
  );
}

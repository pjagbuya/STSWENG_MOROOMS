'use client';

import RoomDeletePopup from './room_delete_popup';
import RoomEditPopup from './room_edit_popup';
import {
  deleteRoomTypeAction,
  editRoomTypeAction,
} from '@/app/manage/room_types/actions';
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
  {
    accessorKey: 'details',
    header: 'Details',
  },
];

export default function RoomTypeTable({ data }) {
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
    await deleteRoomTypeAction(row.original.id);
    setRow(null);
  }

  function handleEditPrompt(row) {
    setRow(row);
    setOpenEditDialog(true);
  }

  async function handleEditContinue(row, form, values) {
    const err = await editRoomTypeAction(
      row.original.id,
      values.name,
      values.details,
    );

    if (err) {
      form.setError('name', err);
      return;
    }

    setOpenEditDialog(false);
    setRow(null);
  }

  return (
    <>
      <DataTable columns={finalColumns} data={data} />

      <RoomDeletePopup
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

      <RoomEditPopup
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

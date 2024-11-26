'use client';

import RoomTypeDeletePopup from '../room_types/room_type_delete_popup';
import RoomTypeEditPopup from '../room_types/room_type_edit_popup';
import { deleteRoomType, editRoomType } from '@/app/manage/room_types/actions';
import { addActionColumn } from '@/components/util/action_dropdown';
import { DataTable } from '@/components/util/data_table';
import { SortableHeader } from '@/components/util/sortable_header';
import { getHHMMTime } from '@/utils/time';
import { useState } from 'react';

const COLUMNS = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <SortableHeader column={column}>Name</SortableHeader>
    ),
  },
  {
    accessorKey: 'room_name',
    header: 'Room Name',
  },
  {
    accessorKey: 'day',
    header: 'Day',
  },
  {
    accessorKey: 'start_time',
    header: 'Start',
    cell: ({ getValue }) => {
      return getHHMMTime(getValue());
    },
  },
  {
    accessorKey: 'end_time',
    header: 'End',
    cell: ({ getValue }) => {
      return getHHMMTime(getValue());
    },
  },
];

export default function PersonalScheduleTable({ data }) {
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
    await deleteRoomType(row.original.id);
    setRow(null);
  }

  function handleEditPrompt(row) {
    setRow(row);
    setOpenEditDialog(true);
  }

  async function handleEditContinue(row, form, values) {
    console.log(values);

    const err = await editRoomType(
      row.original.id,
      values.name,
      values.room_id,
      values.day,
      values.start_time,
      values.end_time,
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

      <RoomTypeDeletePopup
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

      <RoomTypeEditPopup
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

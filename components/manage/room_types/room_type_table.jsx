'use client';

import RoomTypeDeletePopup from './room_type_delete_popup';
import RoomTypeEditPopup from './room_type_edit_popup';
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
    accessorKey: 'details',
    header: 'Details',
  },
  {
    accessorKey: 'capacity',
    header: 'Capacity',
  },
  {
    accessorKey: 'min_reservation_time',
    header: 'Minimum Reservation Time',
    cell: ({ getValue }) => {
      return getHHMMTime(getValue());
    },
  },
  {
    accessorKey: 'max_reservation_time',
    header: 'Maximum Reservation Time',
    cell: ({ getValue }) => {
      return getHHMMTime(getValue());
    },
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
    await deleteRoomType(row.original.id);
    setRow(null);
  }

  function handleEditPrompt(row) {
    setRow(row);
    setOpenEditDialog(true);
  }

  async function handleEditContinue(row, form, values) {
    // console.log(values);

    const err = await editRoomType(
      row.original.id,
      values.name,
      values.details,
      values.capacity,
      values.minReserveTime,
      values.maxReserveTime,
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

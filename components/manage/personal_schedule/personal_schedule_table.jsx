'use client';

import PersonalScheduleDeletePopup from './personal_schedule_delete_popup';
import PersonalScheduleEditPopup from './personal_schedule_edit_popup';
import { deleteRoomType, editRoomType } from '@/app/manage/room_types/actions';
import { edit_personal_schedule } from '@/app/personal_schedule/action';
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

export default function PersonalScheduleTable({ data, rooms }) {
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
    console.log('stuff to edit: ', values);
    console.log('row data: ', row);

    const err = await edit_personal_schedule(
      row.original.personal_schedule_id,
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

      <PersonalScheduleDeletePopup
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

      <PersonalScheduleEditPopup
        row={row}
        open={openEditDialog}
        onEdit={handleEditContinue}
        onOpenChange={v => {
          setOpenEditDialog(v);

          if (!v) {
            setRow(null);
          }
        }}
        rooms={rooms}
      />
    </>
  );
}

'use client';

import { deleteRoomTypeAction } from '@/app/manage/room_types/actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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

  const finalColumns = addActionColumn(COLUMNS, handleDeletePrompt, () => {});

  function handleDeletePrompt(row) {
    setRow(row);
  }

  async function handleDeleteContinue() {
    await deleteRoomTypeAction(row.original.id);
    setRow(null);
  }

  function handleDeleteCancel() {
    setRow(null);
  }

  function handleOpenChange(v) {
    if (!v) {
      setRow(null);
    }
  }

  return (
    <>
      <DataTable columns={finalColumns} data={data} />

      <AlertDialog open={row} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Deleting this room type will also delete all associated rooms of
              the type to delete.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteContinue}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

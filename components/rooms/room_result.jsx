'use client';

import DeleteRoomButton from './delete_room_button';
import EditRoomButton from './edit_room_button';
import { RoomStatus } from './room_status';
import { deleteRoomAction, editRoomAction } from '@/app/rooms/actions';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

export function RoomResult({ isAdmin, room, roomSets, roomTypes }) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [state, formAction] = useFormState(
    editRoomAction.bind(null, room.id),
    null,
  );

  useEffect(() => {
    if (!state) {
      return;
    }

    if (state.status === 'success') {
      setOpenEditDialog(false);
    } else if (state.status === 'error') {
      console.log('Error editing room:', state.error);
    }
  }, [state]);

  async function handleRoomDelete() {
    await deleteRoomAction(room.id);
    setOpenDeleteDialog(false);
  }

  function handleDeleteCancel() {
    setOpenDeleteDialog(false);
  }

  return (
    <div className="relative">
      <Link href={`/rooms/${room.id}`} className="block">
        <article
          className="relative h-52 overflow-hidden rounded-lg border bg-cover bg-center shadow-md transition hover:shadow-lg"
          style={{ backgroundImage: `url(${room.image})` }}
        >
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-gray-800 to-transparent p-4 text-white">
            <h4 className="text-xl font-semibold drop-shadow-md">
              {room.name}
            </h4>
            <p className="text-sm">Location: {room.location}</p>
            <p className="text-sm">Capacity: {room.room_type_capacity} pax</p>

            <RoomStatus status={room.status} />
          </div>
        </article>
      </Link>

      {isAdmin && (
        <div className="absolute bottom-2 right-2 flex space-x-2">
          <EditRoomButton
            room={room}
            roomSets={roomSets}
            roomTypes={roomTypes}
            open={openEditDialog}
            onEdit={formAction}
            onOpenChange={setOpenEditDialog}
          />
          <DeleteRoomButton
            open={openDeleteDialog}
            onCancel={handleDeleteCancel}
            onDelete={handleRoomDelete}
            onOpenChange={setOpenDeleteDialog}
          />
        </div>
      )}
    </div>
  );
}

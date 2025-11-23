'use client';

import DeleteRoomButton from './delete_room_button';
import EditRoomButton from './edit_room_button';
import { RoomStatus } from './room_status';
import { deleteRoomAction } from '@/app/rooms/actions';
import { Can } from '@/components/auth_components/authcomponents';
import { PERMISSIONS } from '@/lib/rbac-config';
import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function RoomResult({ isEditable, room, roomSets, roomTypes }) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

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

      <Can permissions={[PERMISSIONS.ROOM_UPDATE, PERMISSIONS.ROOM_DELETE]}>
        <div className="absolute bottom-2 right-2 flex space-x-2">
          <EditRoomButton
            room={room}
            roomSets={roomSets}
            roomTypes={roomTypes}
            open={openEditDialog}
            // onEdit={formAction}
            onOpenChange={setOpenEditDialog}
          />
          <Link
            className="shadcn-button rounded-full p-2 shadow-md hover:bg-gray-800 hover:bg-opacity-80"
            href={`/rooms/${room.id}/room_schedule`}
          >
            <Calendar className="h-5 w-5 text-gray-300" />
          </Link>
          <DeleteRoomButton
            open={openDeleteDialog}
            onCancel={handleDeleteCancel}
            onDelete={handleRoomDelete}
            onOpenChange={setOpenDeleteDialog}
          />
        </div>
      </Can>
    </div>
  );
}

'use client';

import RoomForm from './forms/room_form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Edit } from 'lucide-react';

export default function EditRoomButton({
  roomSets,
  roomTypes,
  room,
  open,
  onEdit,
  onOpenChange,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="shadcn-button rounded-full p-2 shadow-md hover:bg-gray-800 hover:bg-opacity-80">
          <Edit className="h-5 w-5 text-gray-300" />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Room</DialogTitle>
        </DialogHeader>

        <RoomForm
          values={room}
          roomSets={roomSets}
          roomTypes={roomTypes}
          onSubmit={(form, values) => onEdit(room, form, values)}
        />
      </DialogContent>
    </Dialog>
  );
}

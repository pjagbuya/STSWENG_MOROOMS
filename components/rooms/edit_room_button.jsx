'use client';

import RoomForm from './forms/room_form';
import { editRoomAction } from '@/app/rooms/actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Edit } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';

export default function EditRoomButton({
  roomSets,
  roomTypes,
  room,
  open,
  // onEdit,
  onOpenChange,
}) {
  const roomFormRef = useRef();

  const [roomImageFile, setRoomImageFile] = useState();

  const [state, formAction] = useFormState(
    editRoomAction.bind(null, room.id),
    null,
  );

  useEffect(() => {
    async function fetchRoomImageFile() {
      if (!room || !room.image) {
        return null;
      }

      const response = await (await fetch(room.image)).blob();
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File([response], room.id));

      setRoomImageFile(dataTransfer.files);
    }

    if (open) {
      fetchRoomImageFile();
    }
  }, [open, room]);

  useEffect(() => {
    const roomForm = roomFormRef.current;

    if (!state) {
      return;
    }

    if (state.status === 'success') {
      onOpenChange(false);
    } else if (state.status === 'error') {
      console.log('Error editing room:', state.error);
      roomForm.form.setError('name', state.error); // Temporary hack
    }
  }, [state, onOpenChange]);

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
          ref={roomFormRef}
          values={{ ...room, image_file: roomImageFile }}
          roomSets={roomSets}
          roomTypes={roomTypes}
          onSubmit={formAction}
        />
      </DialogContent>
    </Dialog>
  );
}

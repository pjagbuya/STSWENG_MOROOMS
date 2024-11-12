'use client';

import RoomForm from './forms/room_form';
import { addRoomAction } from '@/app/rooms/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function AddRoomButton({ roomSets, roomTypes }) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(form, values) {
    const err = await addRoomAction(
      values.name,
      values.details,
      values.room_type_id,
      values.room_set_id,
    );

    if (err) {
      form.setError('name', err);
      return;
    }

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-lg shadow-md">
          <Plus className="mr-0.5" />
          Add Room
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Room Set</DialogTitle>
        </DialogHeader>

        <RoomForm
          roomSets={roomSets}
          roomTypes={roomTypes}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}

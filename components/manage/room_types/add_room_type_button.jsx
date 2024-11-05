'use client';

import RoomTypeForm from './forms/room_type_form';
import { addRoomTypeAction } from '@/app/manage/room_types/actions';
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

export default function AddRoomTypeButton() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(form, values) {
    const err = await addRoomTypeAction(values.name, values.details);

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
          Add Room Type
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Room Type</DialogTitle>
        </DialogHeader>

        <RoomTypeForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}

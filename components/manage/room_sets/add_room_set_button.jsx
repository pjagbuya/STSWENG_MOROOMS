'use client';

import RoomSetForm from './forms/room_set_form';
import { addRoomSetAction } from '@/app/manage/room_sets/actions';
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

export default function AddRoomSetButton() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(form, values) {
    const err = await addRoomSetAction(values.name);

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
          Add Room Set
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Room Set</DialogTitle>
        </DialogHeader>

        <RoomSetForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}

'use client';

import PersonalScheduleForm from './forms/personal_schedule_form';
import { create_personal_schedule } from '@/app/personal_schedule/action';
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

export default function AddPersonalScheduleButton({ rooms, userID }) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(form, values) {
    console.log('values in handle submit: ', values);
    console.log('userID: ', userID);
    const err = await create_personal_schedule(
      userID,
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

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-lg shadow-md">
          <Plus className="mr-0.5" />
          Add Personal Schedule
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Personal Schedule</DialogTitle>
        </DialogHeader>

        <PersonalScheduleForm onSubmit={handleSubmit} rooms={rooms} />
      </DialogContent>
    </Dialog>
  );
}

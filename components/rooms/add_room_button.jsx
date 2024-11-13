'use client';

import RoomForm from './forms/room_form';
import { fetchRoomSets } from '@/app/manage/room_sets/actions';
import { fetchRoomTypes } from '@/app/manage/room_types/actions';
import { addRoomAction } from '@/app/rooms/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AddRoomButton() {
  const [roomSets, setRoomSets] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchThings() {
      const roomSets = await fetchRoomSets();
      const roomTypes = await fetchRoomTypes();

      setRoomSets(roomSets);
      setRoomTypes(roomTypes);
    }

    fetchThings();
  }, []);

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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  className="rounded-lg shadow-md"
                  disabled={roomSets.length === 0 || roomTypes.length === 0}
                  onClick={() => setOpen(true)}
                >
                  <Plus className="mr-0.5" />
                  Add Room
                </Button>
              </div>
            </TooltipTrigger>

            {roomSets.length === 0 ||
              (roomTypes.length === 0 && (
                <TooltipContent>
                  <p>
                    Add room types and room sets first before adding a room.
                  </p>
                </TooltipContent>
              ))}
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Room</DialogTitle>
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

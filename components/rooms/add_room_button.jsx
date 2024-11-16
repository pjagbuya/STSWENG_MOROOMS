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
import { useFormState } from 'react-dom';

export default function AddRoomButton() {
  const [roomSets, setRoomSets] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [open, setOpen] = useState(false);

  const [state, formAction] = useFormState(addRoomAction, null);

  useEffect(() => {
    async function fetchThings() {
      const roomSets = await fetchRoomSets();
      const roomTypes = await fetchRoomTypes();

      setRoomSets(roomSets);
      setRoomTypes(roomTypes);
    }

    fetchThings();
  }, []);

  useEffect(() => {
    if (!state) {
      return;
    }

    if (state.status === 'success') {
      setOpen(false);
    } else if (state.status === 'error') {
      console.log('Error adding room:', state.error);
    }
  }, [state]);

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
          onSubmit={formAction}
        />
      </DialogContent>
    </Dialog>
  );
}

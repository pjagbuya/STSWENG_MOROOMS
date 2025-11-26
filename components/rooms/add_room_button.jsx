'use client';

import RoomForm from './forms/room_form';
import { fetchRoomSets } from '@/app/manage/room_sets/actions';
import { fetchRoomTypes } from '@/app/manage/room_types/actions';
import { addRoomAction } from '@/app/rooms/actions';
import { buttonVariants } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';

export default function AddRoomButton() {
  const roomFormRef = useRef();

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
    const roomForm = roomFormRef.current;

    if (!state) {
      return;
    }

    if (state.status === 'success') {
      setOpen(false);
    } else if (state.status === 'error') {
      // console.log('Error adding room:', state.error);
      roomForm.form.setError('name', state.error); // Temporary hack
    }
  }, [state]);

  const disabled = roomSets.length === 0 || roomTypes.length === 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className=""
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              asChild
              className={cn(
                buttonVariants({
                  className:
                    'rounded-lg shadow-md ' +
                    (disabled ? ' bg-gray-400 hover:bg-gray-400' : ''),
                }),
              )}
            >
              <div>
                <Plus className="mr-0.5" />
                Add Room
              </div>
            </TooltipTrigger>

            {disabled && (
              <TooltipContent>
                <p>Add room types and room sets first before adding a room.</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Room</DialogTitle>
        </DialogHeader>

        <RoomForm
          ref={roomFormRef}
          roomSets={roomSets}
          roomTypes={roomTypes}
          onSubmit={formAction}
        />
      </DialogContent>
    </Dialog>
  );
}

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
import { createClient } from '@/utils/supabase/client';
import { Edit } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';

// components/rooms/edit_room_button.jsx
export default function EditRoomButton({
  roomSets,
  roomTypes,
  room,
  open,
  onOpenChange,
}) {
  // console.log('EditRoomButton room:', room);
  // console.log('EditRoomButton room image:', room.image); // Fixed: remove .image_file

  const roomFormRef = useRef();
  const [roomImageFile, setRoomImageFile] = useState();

  const [state, formAction] = useFormState(
    editRoomAction.bind(null, room.id),
    null,
  );

  useEffect(() => {
    async function fetchRoomImageFile() {
      // Fixed: Check room.image instead of room.room_image
      if (!room || !room.image) {
        // console.log('No room or image URL found');
        setRoomImageFile(null);
        return null;
      }

      try {
        // console.log('Fetching image from:', room.image);

        // First try direct fetch (for public buckets)
        let response = await fetch(room.image);

        // console.log('Response status:', response.status);

        if (!response.ok && response.status === 403) {
          // console.log('403 error, trying signed URL...');

          const supabase = createClient();

          // Extract the file path from the full URL
          const urlParts = room.image.split('/');
          const filePath = urlParts.slice(-2).join('/'); // Gets "room_images/filename.ext"

          // console.log('Extracted file path:', filePath);

          // Create a signed URL (valid for 1 hour)
          const { data, error } = await supabase.storage
            .from('Morooms-file')
            .createSignedUrl(filePath, 3600);

          if (error) {
            // console.error('Failed to create signed URL:', error);
            setRoomImageFile(null);
            return null;
          }

          // console.log('Created signed URL:', data.signedUrl);
          response = await fetch(data.signedUrl);
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();
        // console.log(
        //   'Successfully fetched blob:',
        //   blob.size,
        //   'bytes',
        //   blob.type,
        // );

        // Create a proper filename with extension
        const urlParts = room.image.split('/');
        const filename = urlParts[urlParts.length - 1]; // Gets "4c13dd96-524f-4bec-ac97-00bcbd8de6dd.jpeg"

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(new File([blob], filename, { type: blob.type }));
        setRoomImageFile(dataTransfer.files);

        // console.log('Set room image file:', dataTransfer.files);
      } catch (error) {
        // console.error('Failed to fetch room image:', error);
        setRoomImageFile(null);
      }
    }

    if (open) {
      fetchRoomImageFile();
    }
  }, [open, room]);

  // Rest of your useEffect for form handling...
  useEffect(() => {
    const roomForm = roomFormRef.current;

    if (!state) {
      return;
    }

    if (state.status === 'success') {
      onOpenChange(false);
    } else if (state.status === 'error') {
      //
      // console.log('Error editing room:', state.error);
      roomForm.form.setError('name', state.error);
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

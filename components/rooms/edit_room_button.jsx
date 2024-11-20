import { RoomForm } from './forms/room_form';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Edit } from 'lucide-react';

export default function EditRoomButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="shadcn-button rounded-full p-2 shadow-md hover:bg-gray-800 hover:bg-opacity-80">
          <Edit className="h-5 w-5 text-gray-300" />
        </button>
      </DialogTrigger>

      <DialogContent>{/* <RoomForm /> */}</DialogContent>
    </Dialog>
  );
}

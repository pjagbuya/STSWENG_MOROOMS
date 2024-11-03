import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

export default function AddRoomTypeButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-lg shadow-md">
          <Plus className="mr-0.5" />
          Add Room Type
        </Button>
      </DialogTrigger>

      <DialogContent>{/* <RoomTypeForm /> */}</DialogContent>
    </Dialog>
  );
}

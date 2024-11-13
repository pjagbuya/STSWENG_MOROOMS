import RoomSetForm from './forms/room_set_form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function RoomSetEditPopup({ row, open, onEdit, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Room Set</DialogTitle>
        </DialogHeader>

        <RoomSetForm
          values={row?.original}
          onSubmit={(form, values) => onEdit(row, form, values)}
        />
      </DialogContent>
    </Dialog>
  );
}

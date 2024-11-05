import RoomTypeForm from './forms/room_type_form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function RoomEditPopup({ row, open, onEdit, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Room Type</DialogTitle>
        </DialogHeader>

        <RoomTypeForm
          values={row?.original}
          onSubmit={(form, values) => onEdit(row, form, values)}
        />
      </DialogContent>
    </Dialog>
  );
}

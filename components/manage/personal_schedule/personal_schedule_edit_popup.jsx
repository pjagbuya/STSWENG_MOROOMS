import PersonalScheduleForm from './forms/personal_schedule_form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function RoomTypeEditPopup({ row, open, onEdit, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Room Type</DialogTitle>
        </DialogHeader>

        <PersonalScheduleForm
          values={row?.original}
          onSubmit={(form, values) => onEdit(row, form, values)}
        />
      </DialogContent>
    </Dialog>
  );
}

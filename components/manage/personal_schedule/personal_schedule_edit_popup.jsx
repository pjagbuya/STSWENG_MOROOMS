import PersonalScheduleForm from './forms/personal_schedule_form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function PersonalScheduleEditPopup({
  row,
  open,
  onEdit,
  onOpenChange,
  rooms,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Personal Schedule</DialogTitle>
        </DialogHeader>

        <PersonalScheduleForm
          values={row?.original}
          onSubmit={(form, values) => onEdit(row, form, values)}
          rooms={rooms}
        />
      </DialogContent>
    </Dialog>
  );
}

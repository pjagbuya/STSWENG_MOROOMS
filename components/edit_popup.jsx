import { PopupForm } from './popup_form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function EditPopup({
  formSchema,
  title,
  row,
  open,
  onEdit,
  onOpenChange,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <PopupForm
          values={row}
          onSubmit={(form, values) => onEdit(row, form, values)}
          formSchema={formSchema}
        />
      </DialogContent>
    </Dialog>
  );
}

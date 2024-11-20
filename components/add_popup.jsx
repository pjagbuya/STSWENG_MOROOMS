import { AddPopupForm } from './popup_create_form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function AddPopup({ formSchema, title, open, onAdd, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <AddPopupForm
          onSubmit={(form, values) => onAdd(form, values)}
          formSchema={formSchema}
        />
      </DialogContent>
    </Dialog>
  );
}

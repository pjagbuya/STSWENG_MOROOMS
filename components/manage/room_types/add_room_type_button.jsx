'use client';

import { addRoomType } from '@/app/manage/room_types/actions';
import { addRoomTypeAction } from '@/app/manage/room_types/actions';
import { FORM_SCHEMA } from '@/app/manage/room_types/form_schema';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';

export default function AddRoomTypeButton() {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      name: '',
      details: '',
    },
  });

  const [state, formAction] = useFormState(addRoomTypeAction, {});

  useEffect(() => {
    console.log(state);

    if (!state || !state.errors || Object.keys(state.errors).length === 0) {
      form.reset();
      setOpen(false);
      return;
    }

    for (const [field, errors] of Object.entries(state.errors)) {
      form.setError(field, {
        message: errors.join(', '),
      });
    }
  }, [state, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-lg shadow-md">
          <Plus className="mr-0.5" />
          Add Room Type
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Room Type</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="flex flex-col gap-4" action={formAction}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Details</FormLabel>
                  <FormControl>
                    <Input placeholder="Details" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="mt-4" type="submit">
              Add Room Type
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

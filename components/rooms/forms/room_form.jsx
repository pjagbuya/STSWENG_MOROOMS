import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FORM_SCHEMA = z.object({
  name: z.string().min(2, {
    message: 'Room name must be at least 2 characters.',
  }),
  details: z.string().optional(),
  image_file: z.any(),
  room_type_id: z.string().uuid(),
  room_set_id: z.string().uuid(),
});

export default function RoomForm({ roomSets, roomTypes, values, onSubmit }) {
  const formRef = useRef();

  const form = useForm({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      name: values?.name ?? '',
      details: values?.details ?? '',
      room_type_id: values?.room_type_id ?? '',
      room_set_id: values?.room_set_id ?? '',
    },
  });

  return (
    <Form {...form}>
      <form
        ref={formRef}
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(() =>
          onSubmit(new FormData(formRef.current)),
        )}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
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

        <FormField
          control={form.control}
          name="image_file"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel className="font-bold">Image</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  placeholder="Upload Image"
                  accept="image/*"
                  onChange={e => onChange(e.target.files && e.target.files[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="room_type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Room Type</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Room Type" />
                  </SelectTrigger>

                  <SelectContent>
                    {roomTypes.map(t => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="room_set_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Room Set</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Room Set" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomSets.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="mt-4" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}

import { FORM_SCHEMA } from '@/app/manage/room_types/form_schema';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export default function RoomTypeForm({ values, onSubmit }) {
  const form = useForm({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      name: values?.name ?? '',
      details: values?.details ?? '',
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(values => onSubmit(form, values))}
      >
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
          Submit
        </Button>
      </form>
    </Form>
  );
}

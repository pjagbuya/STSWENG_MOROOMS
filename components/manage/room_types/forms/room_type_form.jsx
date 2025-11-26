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
import { useFormWithLogging } from '@/hooks/useFormwithLogging';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';

export default function RoomTypeForm({ values, onSubmit }) {
  const [startTime, setStartTime] = useState(values?.minReserveTime ?? '00:00');

  const form = useFormWithLogging('room-type-form', {
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      name: values?.name ?? '',
      details: values?.details ?? '',
      capacity: values?.capacity ?? 1,
      minReserveTime: startTime,
      maxReserveTime: values?.maxReserveTime ?? '23:59',
    },
  });

  const endTimeRender = useMemo(
    () =>
      // eslint-disable-next-line react/display-name
      ({ field }) => (
        <FormItem>
          <FormLabel className="font-bold">Max Reserve Time</FormLabel>
          <FormControl>
            <Input type="time" {...field} min={startTime} />
          </FormControl>
          <FormMessage />
        </FormItem>
      ),
    [startTime],
  );

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

        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Capacity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Capacity"
                  value={field.value}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="minReserveTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Min Reserve Time</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  value={field.value}
                  onChange={e => {
                    field.onChange(e.target.value);
                    setStartTime(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxReserveTime"
          render={endTimeRender}
        />

        <Button className="mt-4" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}

import { FORM_SCHEMA } from '@/app/users/[user_id]/profile/personal_schedule/form_schema';
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
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function PersonalScheduleForm({ values, onSubmit, rooms }) {
  const [startTime, setStartTime] = useState(values?.start_time ?? '00:00');

  const form = useForm({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      name: values?.name ?? '',
      room_id: values?.room_id ?? '',
      day: values?.day ?? '',
      start_time: startTime,
      end_time: values?.end_time ?? '23:59',
    },
  });
  // console.log('form: ', form.getValues());

  const endTimeRender = useMemo(
    () =>
      // eslint-disable-next-line react/display-name
      ({ field }) => (
        <FormItem>
          <FormLabel className="font-bold">End Time</FormLabel>
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
                <Input placeholder="Name of Schedule" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="room_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Room</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange} // Hook up with React Hook Form
                  defaultValue={field.value} // Use the current field value
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map(room => (
                      <SelectItem key={room.room_id} value={room.room_id}>
                        {room.room_name}
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
          name="day"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Day</FormLabel>
              <FormControl>
                <Select
                  onValueChange={value => field.onChange(Number(value))} // Convert value to number
                  defaultValue={String(field.value)} // Convert initial value to string
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sunday</SelectItem>
                    <SelectItem value="1">Monday</SelectItem>
                    <SelectItem value="2">Tuesday</SelectItem>
                    <SelectItem value="3">Wednesday</SelectItem>
                    <SelectItem value="4">Thursday</SelectItem>
                    <SelectItem value="5">Friday</SelectItem>
                    <SelectItem value="6">Saturday</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Start Time</FormLabel>
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
          name="end_time"
          render={endTimeRender}
        />

        <Button className="mt-4" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}

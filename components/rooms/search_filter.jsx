'use client';

import { Input } from '../ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getDateString } from '@/utils/time';
import { zodResolver } from '@hookform/resolvers/zod';
import { SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// NOTE: <input type="time"> takes in nonstandard time strings for some reason,
// hence the use of string() instead of string().time().
const FORM_SCHEMA = z.object({
  date: z.date(),
  startTime: z.string(),
  endTime: z.string().optional(),
  roomSetId: z.string().optional(),
  minCapacity: z.number().int().gte(0).optional(),
});

export default function SearchFilter({ filters, roomSets, onSearch }) {
  const [startTime, setStartTime] = useState(filters.startTime);
  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      ...filters,
      date: new Date(filters.date),
      setRoomId: 'none',
    },
  });

  const endTimeRender = useMemo(
    () =>
      // eslint-disable-next-line react/display-name
      ({ field }) => (
        <FormItem>
          <FormLabel className="font-bold">To</FormLabel>

          <FormControl>
            <Input type="time" {...field} min={startTime} />
          </FormControl>

          <FormMessage />
        </FormItem>
      ),
    [startTime],
  );

  useEffect(() => {
    setOpenDialog(false);
  }, [filters]);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 rounded-lg shadow-sm">
          <SlidersHorizontal />
          <span>Filter</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(values => {
              console.log(values);
              onSearch({
                name: filters.name || undefined,
                date: getDateString(values.date),
                startTime: values.startTime,
                endTime: values.endTime || undefined,
                roomSetId: values.roomSetId || undefined,
                minCapacity: values.minCapacity || undefined,
              });
            })}
          >
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-bold">Date</FormLabel>

                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={{ before: new Date() }}
                      initialFocus
                    />
                  </FormItem>
                )}
              />

              <div className="flex flex-1 flex-col gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">From</FormLabel>

                      <FormControl>
                        <Input
                          type="time"
                          value={field.value}
                          onChange={e => {
                            field.onChange(e.target.value);
                            setStartTime(e.target.value);
                          }}
                          min={filters.startTime}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={endTimeRender}
                />

                <FormField
                  control={form.control}
                  name="roomSetId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Set</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Room Set" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem selected>None</SelectItem>

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

                <FormField
                  control={form.control}
                  name="minCapacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">
                        Capacity (at least)
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="number"
                          value={field.value}
                          onChange={e => field.onChange(Number(e.target.value))}
                          min={0}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button type="submit">Apply</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

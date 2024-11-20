import { FORM_SCHEMA } from '@/app/rooms/form_schema';
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
import FileInput from '@/components/util/file_input';
import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useForm } from 'react-hook-form';

const RoomForm = forwardRef(function RoomForm(
  { roomSets, roomTypes, values, onSubmit },
  ref,
) {
  const formRef = useRef();

  const form = useForm({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      name: values?.name ?? '',
      details: values?.details ?? '',
      image_file: values?.image_file ?? '',
      room_type_id: values?.room_type_id ?? '',
      room_set_id: values?.room_set_id ?? '',
    },
  });

  useEffect(() => {
    form.setValue('image_file', values?.image_file ?? '');
  }, [form, values]);

  useImperativeHandle(ref, () => {
    return {
      get form() {
        return form;
      },
    };
  }, [form]);

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
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel className="font-bold">Image</FormLabel>
              <FormControl>
                <FileInput
                  {...fieldProps}
                  placeholder="Upload Image"
                  accept="image/*"
                  onChange={e => onChange(e.target.files)}
                  onReset={() => form.setValue('image_file', null)}
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
});

export default RoomForm;

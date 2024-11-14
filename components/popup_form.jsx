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

export function PopupForm({ formSchema, values, onSubmit }) {
  values = values ? formSchema.parse(values) : null;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...Object.keys(values || {}).reduce((acc, key) => {
        acc[key] = values[key] ?? '';
        return acc;
      }, {}),
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(values => onSubmit(form, values))}
      >
        {values
          ? Object.keys(values).map(val => {
              return (
                <FormField
                  control={form.control}
                  name={val}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">{val}</FormLabel>
                      <FormControl>
                        <Input placeholder="Type" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })
          : null}

        <Button className="mt-4" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}

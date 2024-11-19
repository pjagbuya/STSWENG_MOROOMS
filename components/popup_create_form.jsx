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

export function AddPopupForm({ formSchema, onSubmit }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proof: null,
    },
  });

  function onChange(key, e) {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      form.setValue(key, file, { shouldValidate: true }); // Update the form's state
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(values => onSubmit(form, values))}
      >
        {Object.entries(formSchema.shape).map(([key, value]) => {
          return (
            <FormField
              control={form.control}
              name={key}
              key={key}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">{key}</FormLabel>
                  <FormControl>
                    {value?.description?.toLowerCase() === 'image' ? (
                      <input
                        type="file"
                        {...field}
                        onChange={e => onChange(key, e)}
                        value={undefined}
                      />
                    ) : (
                      <Input placeholder="Type" {...field} />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}

        <Button className="mt-4" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}

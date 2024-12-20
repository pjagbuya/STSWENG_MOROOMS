import { Combobox } from './role-combobox';
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

export function AddPopupForm({ formSchema, onSubmit, defaultValues }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {},
  });

  function onChange(key, e) {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      form.setValue(key, file, { shouldValidate: true }); // Update the form's state
    }
  }

  function camelCaseToTitleCase(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters
      .replace(/^./, char => char.toUpperCase()); // Capitalize the first letter
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
                  <FormLabel className="font-bold">
                    {camelCaseToTitleCase(key)}
                  </FormLabel>
                  <FormControl>
                    {value?.description?.toLowerCase() === 'image' ? (
                      <label className="relative block rounded-md border-2 border-dashed border-gray-300 p-1">
                        <input
                          type="file"
                          {...field}
                          onChange={e => onChange(key, e)}
                          value={undefined}
                          className="sr-only h-32"
                        />
                        <div className="flex max-h-32 w-full flex-col items-center justify-center rounded-md bg-gray-100 p-2 text-center text-base text-gray-700 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                          {field.value?.name || 'Choose a file'}
                        </div>
                      </label>
                    ) : value?.description?.toLowerCase() === 'password' ? (
                      <Input
                        placeholder="Enter Password"
                        type="password"
                        {...field}
                      />
                    ) : value?.description?.toLowerCase() === 'dropdown' ? (
                      <Combobox
                        className="w-full"
                        data={['user', 'admin']}
                        currentValue={'admin'}
                        // onSelect={}
                      />
                    ) : (
                      <Input
                        placeholder={'Enter ' + camelCaseToTitleCase(key)}
                        {...field}
                      />
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

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export function AddPopupForm({
  formSchema,
  onSubmit,
  defaultValues,
  includeSecurityQuestions,
  securityQuestions = [],
}) {
  const [selectedQuestions, setSelectedQuestions] = useState({
    q1: '',
    q2: '',
  });

  const form = useForm({
    resolver: formSchema ? zodResolver(formSchema) : undefined,
    defaultValues: defaultValues || {},
  });

  function onChange(key, e) {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      form.setValue(key, file, { shouldValidate: true });
    }
  }

  function camelCaseToTitleCase(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, char => char.toUpperCase());
  }

  // Return null or loading state if formSchema is not available
  if (!formSchema || !formSchema.shape) {
    return <div>Loading form...</div>;
  }

  return (
    <Form {...form}>
      <form
        className="flex min-h-[600px] flex-col gap-6"
        onSubmit={form.handleSubmit(values => {
          console.log('Popup form - values:', values); // Values are this forms dictionary of data
          console.log('Popup form - selectedQuestions:', selectedQuestions);
          onSubmit(form, values, selectedQuestions);
        })}
      >
        {/* Two-column layout */}
        <div
          className={`grid gap-6 ${includeSecurityQuestions ? 'grid-cols-2' : 'grid-cols-1'}`}
        >
          {/* Left Column - Regular Form Fields */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-lg font-medium">
              Account Information
            </h3>

            {Object.entries(formSchema.shape).map(([key, value]) => {
              // Skip security answer fields as they're handled in the right column
              if (key === 'securityAnswer1' || key === 'securityAnswer2') {
                return null;
              }

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
          </div>

          {/* Right Column - Security Questions */}
          {includeSecurityQuestions && (
            <div className="space-y-4 border-l pl-6">
              <h3 className="border-b pb-2 text-lg font-medium">
                Security Questions
              </h3>
              <p className="text-sm text-gray-600">
                These will be used to recover your account if you forget your
                password.
              </p>

              {/* Debug info */}
              <div className="text-xs text-gray-500">
                Available questions: {securityQuestions.length}
              </div>

              {/* Question 1 */}
              <FormField
                name="securityQuestion1"
                render={() => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      Security Question 1
                    </FormLabel>
                    <Select
                      value={selectedQuestions.q1}
                      onValueChange={value => {
                        console.log('Selected question 1:', value);
                        setSelectedQuestions(prev => ({ ...prev, q1: value }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a question" />
                      </SelectTrigger>
                      <SelectContent>
                        {securityQuestions.map(q => (
                          <SelectItem key={q.id} value={q.id.toString()}>
                            {q.question}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="securityAnswer1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Answer 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Your answer..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Question 2 */}
              <FormField
                name="securityQuestion2"
                render={() => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      Security Question 2
                    </FormLabel>
                    <Select
                      value={selectedQuestions.q2}
                      onValueChange={value => {
                        console.log('Selected question 2:', value);
                        setSelectedQuestions(prev => ({ ...prev, q2: value }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a different question" />
                      </SelectTrigger>
                      <SelectContent>
                        {securityQuestions
                          .filter(q => q.id.toString() !== selectedQuestions.q1)
                          .map(q => (
                            <SelectItem key={q.id} value={q.id.toString()}>
                              {q.question}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="securityAnswer2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Answer 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Your answer..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        {/* Centered Submit Button spanning both columns */}
        <div className="flex justify-center border-t pt-4">
          <Button type="submit" className="px-8 py-2">
            {includeSecurityQuestions ? 'Create Account' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

'use client';

import { AddPopupForm } from './popup_create_form';
import { PopupForm } from './popup_form';
import { signup, uploadFile } from '@/app/signup/action';
import { singupSchema } from '@/app/signup/form_schema';
import { userEditFormSchema } from '@/app/users/[user_id]/home/admin/users/form_schema';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export function Signup() {
  return (
    <Card className="mx-auto w-[425px] max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Step 1: Fill account details</CardTitle>
        <CardDescription>
          Fill out the following details. Click next once done.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AddPopupForm
          onSubmit={(form, values) => {
            async function handleSubmit() {
              const formData = new FormData();
              for (const key in values) {
                console.log(key, values[key]);
                formData.append(key, values[key]);
              }
              await signup(formData);
            }
            handleSubmit();
          }}
          formSchema={singupSchema}
        />
        <div className="mt-2 flex justify-center gap-2">
          <p>Already have an account?</p>
          <Link href="/login" className="text-blue-500 underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

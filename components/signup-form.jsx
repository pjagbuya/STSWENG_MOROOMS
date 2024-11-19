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
        {/* <form action={signup}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input
                name="user_first_name"
                id="first-name"
                type="text"
                placeholder="John"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input
                name="user_last_name"
                id="last-name"
                type="text"
                placeholder="Doe"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="school-id">School ID</Label>
              <Input
                name="user_school_id"
                id="school-id"
                type="text"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                name="user_email"
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                name="user_password"
                id="password"
                type="password"
                placeholder="********"
                required
              />
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="w-full">
              Signup
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </form> */}
      </CardContent>
    </Card>
  );
}

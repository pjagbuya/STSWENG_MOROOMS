'use client';

import { SubmitButton } from '@/components/buttons/submit-button';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ErrorMessage } from '@/components/ui/error-message';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/hooks/use-login';
import Link from 'next/link';

export function LoginForm() {
  const { state, formAction, isRedirecting } = useLogin();
  return (
    <Card className="mx-auto w-[425px] max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email and password to access the site.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <ErrorMessage error={state.error} isLocked={state.locked} />

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                disabled={isRedirecting}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                name="password"
                id="password"
                type="password"
                required
                disabled={isRedirecting}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <SubmitButton isRedirecting={isRedirecting}>Login</SubmitButton>
            </div>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
          <div className="text-center text-sm">
            <Link
              href="/login/forgot-password"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Forgot your password?
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

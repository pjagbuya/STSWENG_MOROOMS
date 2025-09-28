'use client';

import { login } from '@/app/login/action';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useFormStatus } from 'react-dom';

// Separate button component that uses form status
function SubmitButton({ isRedirecting }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full"
      disabled={pending || isRedirecting}
    >
      {pending || isRedirecting ? 'Logging in...' : 'Login'}
    </Button>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Handle form submission with client-side redirect
  const handleLoginAction = async (prevState, formData) => {
    const result = await login(prevState, formData);
    if (result.success) {
      setIsRedirecting(true);
      // Small delay before redirect to ensure UI updates
      setTimeout(() => {
        router.push('/');
      }, 100);
    }
    return result;
  };

  // Initialize form state with our custom handler
  const [state, formAction] = useFormState(handleLoginAction, { error: '' });

  // Use this to handle redirection if state updates outside of action
  useEffect(() => {
    if (state.success) {
      setIsRedirecting(true);
      // Small delay before redirect to ensure UI updates
      const redirectTimer = setTimeout(() => {
        router.push('/');
      }, 100);
      return () => clearTimeout(redirectTimer);
    }
  }, [state.success, router]);

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
          {state.error && (
            <div className="mb-4 rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-600">{state.error}</p>
            </div>
          )}
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
              <SubmitButton isRedirecting={isRedirecting} />
            </div>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

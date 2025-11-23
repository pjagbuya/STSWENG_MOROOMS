'use client';

import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';

export function SubmitButton({
  children,
  isRedirecting = false,
  className = 'w-full',
  ...props
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className={className}
      disabled={pending || isRedirecting}
      {...props}
    >
      {pending || isRedirecting ? 'Logging in...' : children}
    </Button>
  );
}

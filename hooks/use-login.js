'use client';

import { login } from '@/app/login/action';
import { useAuth } from '@/components/auth_components/authprovider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

export function useLogin() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Handle form submission with client-side redirect
  const handleLoginAction = async (prevState, formData) => {
    const result = await login(prevState, formData);
    if (result.success) {
      setIsRedirecting(true);
      await refreshUser();

      // Small delay before redirect to ensure UI updates
      setTimeout(() => {
        router.push('/');
      }, 100);
    }
    return result;
  };

  // Initialize form state with our custom handler
  const [state, formAction] = useFormState(handleLoginAction, { error: '' });

  // Handle redirection if state updates outside of action
  useEffect(() => {
    if (state.success) {
      setIsRedirecting(true);
      const redirectTimer = setTimeout(() => {
        router.push('/');
      }, 100);
      return () => clearTimeout(redirectTimer);
    }
  }, [state.success, router]);

  return {
    state,
    formAction,
    isRedirecting,
  };
}

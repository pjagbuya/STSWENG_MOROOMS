'use client';

import { Button } from './ui/button';
import { logout } from '@/app/logout/actions';
import { useRouter } from 'next/navigation';

const SignOutButton = () => {
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await logout();
      router.refresh();
      window.location.href = '/login';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <Button
      className="border border-white hover:brightness-110 active:brightness-75"
      onClick={handleSignOut}
    >
      Log Out
    </Button>
  );
};

export default SignOutButton;

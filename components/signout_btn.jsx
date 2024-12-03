'use client';

import { Button } from './ui/button';
import { createClient } from '@/utils/supabase/client';

const SignOutButton = () => {
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
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

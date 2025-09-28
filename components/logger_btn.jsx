'use client';

import { Button } from './ui/button';
import { createClient } from '@/utils/supabase/client';

const LoggerButton = () => {
  return (
    <Button
      className="border border-white hover:brightness-110 active:brightness-75"
      onClick={handleLogger}
    >
      View Logs
    </Button>
  );
};

export default LoggerButton;

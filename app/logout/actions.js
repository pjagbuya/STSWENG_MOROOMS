// app/logout/actions.js
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// app/logout/actions.js

// app/logout/actions.js

// app/logout/actions.js

export async function logout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout error:', error);
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/login');
}

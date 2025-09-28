'use server';

import { APILogger } from '@/utils/logger_actions';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(prevState, formData) {
  const supabase = createClient();

  // Extract data as simple strings
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      await APILogger.log(
        'login',
        'POST',
        'auth',
        null,
        { email },
        error.message,
      );
      return { error: error.message || 'Authentication failed' };
    }

    await APILogger.log('login', 'POST', 'auth', data.user?.id, { email });

    // On successful login, revalidate relevant paths
    revalidatePath('/', 'layout');

    // Success case - return a success flag
    return { success: true };
  } catch (err) {
    await APILogger.log('login', 'POST', 'auth', null, { email }, err.message);
    return { error: 'An unexpected error occurred' };
  }
}

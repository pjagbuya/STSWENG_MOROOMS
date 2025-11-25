'use server';

import { refreshUser } from '@/components/auth_components/authprovider';
import { APILogger } from '@/utils/logger_actions';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const LOCKOUT_THRESHOLD = 5; // Number of failed attempts before lockout
const LOCKOUT_DURATION_MS = 10 * 60 * 1000; // 10 minutes in milliseconds
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes window for counting attempts

/**
 * Check if account is locked based on failed login attempts in logs table
 * @param {string} email - User's email address
 * @returns {Promise<{isLocked: boolean, remainingTime?: number, attemptCount: number}>}
 */
async function checkAccountLockout(email) {
  const supabase = createClient();
  const windowStart = new Date(Date.now() - ATTEMPT_WINDOW_MS);

  try {
    // Query logs table for the last successful login for this email
    const { data: successfulLogins, error: successError } = await supabase
      .from('logs')
      .select('*')
      .eq('action', 'login')
      .eq('status', 'success')
      .eq('table', 'auth')
      .order('timestamp', { ascending: false })
      .limit(1);

    if (successError) {
      console.error('Error querying successful login:', successError);
    }

    // Get the timestamp of the last successful login
    const lastSuccessfulLogin = (successfulLogins || []).find(log => {
      try {
        return log.data && JSON.parse(log.data).email === email;
      } catch {
        return false;
      }
    });

    const lastSuccessTimestamp = lastSuccessfulLogin
      ? new Date(lastSuccessfulLogin.timestamp)
      : null;

    // Query logs table for failed login attempts within the time window
    const { data: failedAttempts, error } = await supabase
      .from('logs')
      .select('*')
      .eq('action', 'login')
      .eq('status', 'error')
      .eq('table', 'auth')
      .eq('error', 'Invalid login credentials')
      .gte('timestamp', windowStart.toISOString())
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error querying failed login attempts:', error);
      return { isLocked: false, attemptCount: 0 };
    }

    // Filter attempts that match this email AND are within the sliding window AND after last successful login
    const now = new Date();
    const matchingAttempts = (failedAttempts || []).filter(log => {
      try {
        const logTimestamp = new Date(log.timestamp);
        const isWithinWindow =
          logTimestamp >= windowStart && logTimestamp <= now;
        const emailMatches = log.data && JSON.parse(log.data).email === email;
        const isAfterLastSuccess = lastSuccessTimestamp
          ? logTimestamp > lastSuccessTimestamp
          : true;
        return isWithinWindow && emailMatches && isAfterLastSuccess;
      } catch {
        return false;
      }
    });

    console.log(999999, matchingAttempts);

    const attemptCount = matchingAttempts.length;

    // Check if account should be locked
    if (attemptCount >= LOCKOUT_THRESHOLD) {
      // Get the timestamp of the most recent failed attempt
      const mostRecentAttempt = matchingAttempts[0];
      const lockoutEnd = new Date(
        new Date(mostRecentAttempt.timestamp).getTime() + LOCKOUT_DURATION_MS,
      );

      if (now < lockoutEnd) {
        const remainingTime = Math.ceil((lockoutEnd - now) / 1000 / 60); // Minutes
        return { isLocked: true, remainingTime, attemptCount };
      }
    }

    return { isLocked: false, attemptCount };
  } catch (err) {
    console.error('Error in checkAccountLockout:', err);
    return { isLocked: false, attemptCount: 0 };
  }
}

export async function login(prevState, formData) {
  const supabase = createClient();

  // Extract data as simple strings
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    // Check if account is locked before attempting authentication
    const lockoutStatus = await checkAccountLockout(email);

    if (lockoutStatus.isLocked) {
      const errorMsg = `Account locked due to multiple failed login attempts. Please try again in ${lockoutStatus.remainingTime} minute${lockoutStatus.remainingTime !== 1 ? 's' : ''}.`;

      // Log the lockout attempt
      await APILogger.log(
        'login',
        'POST',
        'auth',
        null,
        { email, locked: true, remainingTime: lockoutStatus.remainingTime },
        'Account locked',
      );

      return {
        error: errorMsg,
        locked: true,
        remainingTime: lockoutStatus.remainingTime,
      };
    }

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

      // Re-check lockout status after logging this failure to apply sliding window
      const updatedLockoutStatus = await checkAccountLockout(email);

      if (updatedLockoutStatus.isLocked) {
        return {
          error: `Account locked due to multiple failed login attempts. Please try again in ${updatedLockoutStatus.remainingTime} minute${updatedLockoutStatus.remainingTime !== 1 ? 's' : ''}.`,
          locked: true,
          remainingTime: updatedLockoutStatus.remainingTime,
        };
      }

      return { error: error.message || 'Invalid username or password' };
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

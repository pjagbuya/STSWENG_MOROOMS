'use server';

import { createClient } from '@/utils/supabase/server';
import crypto from 'crypto';

// Store tokens in memory (in production, use Redis or database)
// Token format: { token: { userId, timestamp, passwordChangeAllowed } }
const reauthTokens = new Map();

// Token expiry time (5 minutes)
const TOKEN_EXPIRY_MS = 5 * 60 * 1000;

// Clean up expired tokens periodically
function cleanupExpiredTokens() {
  const now = Date.now();
  for (const [token, data] of reauthTokens.entries()) {
    if (now - data.timestamp > TOKEN_EXPIRY_MS) {
      reauthTokens.delete(token);
    }
  }
}

/**
 * Server action to re-authenticate the user before sensitive operations.
 * Verifies the current password and checks if password change is allowed.
 */
export async function reauthenticate(prevState, formData) {
  const currentPassword = formData.get('currentPassword');
  const email = formData.get('email');

  if (!currentPassword || !email) {
    return { error: 'Email and password are required' };
  }

  const supabase = createClient();

  // Get current authenticated user
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    return { error: 'You must be logged in to perform this action' };
  }

  const userId = authData.user.id;

  // Verify the email matches the current user
  if (authData.user.email !== email) {
    return { error: 'Email mismatch' };
  }

  // Verify the current password by attempting to sign in
  // We use a separate client call to verify credentials
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });

  if (signInError) {
    return { error: 'Invalid password. Please try again.' };
  }

  // Check if password was recently changed (within 24 hours)
  const recentlyChanged = await passwordRecentlyChanged(supabase, userId);

  // Clean up old tokens
  cleanupExpiredTokens();

  // Generate a secure token
  const token = crypto.randomBytes(32).toString('hex');

  // Store token with metadata
  reauthTokens.set(token, {
    userId,
    timestamp: Date.now(),
    passwordChangeAllowed: !recentlyChanged,
  });

  return {
    success: true,
    token,
    passwordChangeAllowed: !recentlyChanged,
    message: recentlyChanged
      ? 'Note: Password was changed within the last 24 hours and cannot be changed again yet.'
      : null,
  };
}

/**
 * Validates a re-authentication token.
 * Returns the token data if valid, or null if invalid/expired.
 */
export async function validateReauthToken(token) {
  if (!token) {
    return { valid: false, error: 'No token provided' };
  }

  const tokenData = reauthTokens.get(token);

  if (!tokenData) {
    return { valid: false, error: 'Invalid or expired token' };
  }

  // Check if token has expired
  if (Date.now() - tokenData.timestamp > TOKEN_EXPIRY_MS) {
    reauthTokens.delete(token);
    return {
      valid: false,
      error: 'Token has expired. Please re-authenticate.',
    };
  }

  // Verify the token belongs to the current user
  const supabase = createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user || authData.user.id !== tokenData.userId) {
    reauthTokens.delete(token);
    return { valid: false, error: 'Token user mismatch' };
  }

  return {
    valid: true,
    userId: tokenData.userId,
    passwordChangeAllowed: tokenData.passwordChangeAllowed,
  };
}

/**
 * Consumes (invalidates) a re-authentication token after use.
 */
export function consumeReauthToken(token) {
  reauthTokens.delete(token);
}

/**
 * Check if password was recently changed (within 24 hours)
 */
async function passwordRecentlyChanged(supabase, userId) {
  const { data: passwordHistory, error } = await supabase
    .from('password_history')
    .select('created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!passwordHistory || error) {
    return false;
  }

  const lastPasswordChange = new Date(passwordHistory.created_at);
  const now = new Date();
  const hoursSinceLastChange = (now - lastPasswordChange) / (1000 * 60 * 60);

  return hoursSinceLastChange < 24;
}

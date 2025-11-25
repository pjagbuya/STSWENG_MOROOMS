'use server';

import { callFunctionWithFormData } from '@/utils/action_template';
import { createClient } from '@/utils/supabase/server';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

// ============================================================================
// Password Change Eligibility Check
// ============================================================================

/**
 * Check if user can change their password (not changed within 24 hours).
 * This is a server action called BEFORE showing the re-auth modal.
 * Compatible with useFormState - takes prevState as first argument.
 */
export async function checkPasswordChangeEligibility(prevState) {
  const supabase = createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    return { allowed: false, error: 'You must be logged in' };
  }

  const recentlyChanged = await passwordRecentlyChanged(
    supabase,
    authData.user.id,
  );

  if (recentlyChanged) {
    return {
      allowed: false,
      error: 'Cannot change password more than once within 24 hours.',
    };
  }

  return { allowed: true, error: '' };
}

/**
 * Server action to verify current password and change to new password.
 * This combines re-authentication and password change in one step.
 */
export async function reauthenticateAndChangePassword(prevState, formData) {
  const currentPassword = formData.get('currentPassword');
  const newPassword = formData.get('newPassword');
  const email = formData.get('email');

  if (!currentPassword || !email || !newPassword) {
    return { error: 'All fields are required' };
  }

  const supabase = createClient(true);

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
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });

  if (signInError) {
    return { error: 'Invalid current password. Please try again.' };
  }

  // Check if password was recently changed (within 24 hours)
  const recentlyChanged = await passwordRecentlyChanged(supabase, userId);
  if (recentlyChanged) {
    return {
      error: 'Cannot change password more than once within 24 hours.',
    };
  }

  // Check if password has been used before
  if (await passwordHasBeenUsedBefore(supabase, userId, newPassword)) {
    return { error: 'Cannot reuse previous passwords.' };
  }

  // All validations passed - update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { error: 'Failed to update password. Please try again.' };
  }

  // Log password hash in password history
  const salt = await bcrypt.genSalt(12);
  const hashedNewPassword = await bcrypt.hash(newPassword, salt);

  await supabase.from('password_history').insert({
    user_id: userId,
    hashed_password: hashedNewPassword,
    created_at: new Date().toISOString(),
    salt: salt,
  });

  return { success: true };
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

// ============================================================================
// User Profile Actions
// ============================================================================

export async function getUserInfo() {
  const supabase = createClient();
  const { data: userInfo, error } = await supabase.auth.getUser();
  const { data: user, error: error2 } = await supabase.rpc('get_user_by_id', {
    p_user_id: userInfo.user.id,
  });

  if (error) {
    console.log(error.message);
  }

  if (error2) {
    console.log(error2.message);
  }

  const finalData = {
    userId: user[0].user_id,
    userFirstname: user[0].user_firstname,
    userLastname: user[0].user_lastname,
    email: userInfo.user.email,
  };

  return finalData;
}

async function uploadFile(file, path) {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from('Morooms-file')
    .upload(`profile${path ? `/${path}` : ''}/${file.name}`, file, {
      upsert: true,
    });
  if (error) {
    console.error(error);
  }
}

export async function editProfile(prevState, formData) {
  const supabase = createClient(true);

  const { data: userInfo, error: authError } = await supabase.auth.getUser();

  if (authError || !userInfo?.user) {
    return { error: 'Unable to authenticate user' };
  }

  const userId = userInfo.user.id;

  // Update email if changed
  const data = {
    email: formData.get('email'),
  };

  console.log('data', data);

  const { data: user_signin_data, error } =
    await supabase.auth.updateUser(data);

  if (error) {
    console.log(error.message);
  }

  const file = formData.get('userProfilepic');
  const path = userId;
  console.log('file', file);

  formData.delete('email');
  formData.delete('password');
  formData.delete('userProfilepic');
  formData.append('user_id', userId);
  if (file && file != 'undefined') {
    formData.append('userProfilepic', file.name);
  }
  console.log('formData', formData);

  if (error) {
    console.log(error.message);
    redirect('/error');
  }

  // create user info
  callFunctionWithFormData(null, 'edit_user_by_id', '/private', formData, null);
  if (file && file != 'undefined') {
    uploadFile(file, path);
  }

  redirect('./');
}

async function passwordHasBeenUsedBefore(supabase, userId, newPassword) {
  // Fetch all password history entries with their hashed passwords
  const { data: passwordHistory, error } = await supabase
    .from('password_history')
    .select('hashed_password')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error || !passwordHistory || passwordHistory.length === 0) {
    return false;
  }

  // Compare the new password against each stored hash
  for (const entry of passwordHistory) {
    const isMatch = await bcrypt.compare(newPassword, entry.hashed_password);
    if (isMatch) {
      console.log('Password has been used before');
      return true;
    }
  }

  return false;
}

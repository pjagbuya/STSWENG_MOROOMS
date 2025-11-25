'use server';

import { callFunctionWithFormData } from '@/utils/action_template';
import { createClient } from '@/utils/supabase/server';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

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
  const newPassword = formData.get('password');
  const currentPassword = formData.get('currentPassword');
  const isChangingPassword = newPassword && newPassword.trim() !== '';

  // Handle password change if requested
  if (isChangingPassword) {
    // SECURITY: Require current password verification for password changes
    if (!currentPassword) {
      return { error: 'Current password is required to change password.' };
    }

    // Verify the current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userInfo.user.email,
      password: currentPassword,
    });

    if (signInError) {
      return { error: 'Invalid current password.' };
    }

    const recentlyChanged = await passwordRecentlyChanged(supabase, userId);
    if (recentlyChanged) {
      return {
        error: 'Cannot change password more than once within 24 hours.',
      };
    }

    if (await passwordHasBeenUsedBefore(supabase, userId, newPassword)) {
      return { error: 'Cannot reuse previous passwords.' };
    }

    // Update password
    const { error: passwordError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (passwordError) {
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
  }

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

'use server';

import { callFunctionWithFormData } from '@/utils/action_template';
import { createClient } from '@/utils/supabase/server';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

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
  let editStatus = '';

  const supabase = createClient();

  // sign up
  const data = {
    email: formData.get('email'),
  };

  const password = formData.get('password');
  console.log('password', password);

  if (password && password != 'undefined') {
    const { data: userInfo, error: authError } = await supabase.auth.getUser();

    if (authError || !userInfo?.user) {
      return { error: 'Unable to authenticate user' };
    }

    const userId = userInfo.user.id;

    if (await passwordRecentlyChanged(supabase, userId)) {
      editStatus = 'Cannot change password more than once within 24 hours.';
    }

    if (await passwordHasBeenUsedBefore(supabase, userId, password)) {
      editStatus = 'Cannot reuse previous passwords.';
    }

    if (!editStatus) {
      data.password = password;
    }
  }

  console.log('data', data);

  const { data: user_signin_data, error } =
    await supabase.auth.updateUser(data);

  if (error) {
    console.log(error.message);
  }

  if (data.password) {
    // Log password hash in password history
    const hashedNewPassword = await bcrypt.hash(data.password, 12);

    await supabase.from('password_history').insert({
      user_id: user_signin_data.user.id,
      hashed_password: hashedNewPassword,
      created_at: new Date().toISOString(),
    });
  }

  const file = formData.get('userProfilepic');
  const path = user_signin_data.user.id;
  console.log('file', file);

  formData.delete('email');
  formData.delete('password');
  formData.delete('userProfilepic');
  formData.append('user_id', user_signin_data.user.id);
  if (file && file != 'undefined') {
    formData.append('userProfilepic', file.name);
  }
  console.log('formData', formData);

  if (error) {
    console.log(error.message);
    redirect('/error');
  }

  if (editStatus) {
    return { error: editStatus };
  }

  // create user info
  callFunctionWithFormData(null, 'edit_user_by_id', '/private', formData, null);
  if (file && file != 'undefined') {
    uploadFile(file, path);
  }

  redirect('./');
}

async function passwordHasBeenUsedBefore(supabase, userId, newPassword) {
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const { data: passwordHistory, error } = await supabase
    .from('password_history')
    .select('hashed_password')
    .eq('user_id', userId)
    .eq('hashed_password', hashedPassword)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    return false;
  }

  console.log(65656, passwordHistory);

  return passwordHistory && passwordHistory.length > 0;
}

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

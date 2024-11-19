'use server';

import { callFunctionWithFormData } from '@/utils/action_template';
import { createClient } from '@/utils/supabase/server';
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

export async function editProfile(formData) {
  // sign up
  const data = {
    email: formData.get('email'),
  };
  const password = formData.get('password');
  if (password && password != 'undefined') {
    data.password = password;
  }

  const supabase = createClient();

  const { data: user_signin_data, error } =
    await supabase.auth.updateUser(data);

  if (error) {
    console.log(error.message);
  }

  const file = formData.get('userProfilepic');
  const path = user_signin_data.user.id;

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

  // create user info
  callFunctionWithFormData(null, 'edit_user_by_id', '/private', formData, null);
  if (file && file != 'undefined') {
    uploadFile(file, path);
  }

  redirect('./');
}

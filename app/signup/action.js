'use server';

import { callFunctionWithFormData } from '@/utils/action_template';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

async function uploadFile(file, path) {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from('Morooms-file')
    .upload(`proof${path ? `/${path}` : ''}/${file.name}`, file, {
      upsert: true,
    });
  if (error) {
    console.error(error);
  }
}

export async function signup(formData) {
  // sign up
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const supabase = createClient();

  const { data: user_signin_data, error } = await supabase.auth.signUp(data);
  const file = formData.get('proof');
  const path = user_signin_data.user.id;

  formData.delete('email');
  formData.delete('password');
  formData.delete('proof');
  formData.append('user_id', user_signin_data.user.id);
  formData.append('proof', file.name);

  if (error) {
    console.log(error.message);
    redirect('/error');
  }

  // create user info
  callFunctionWithFormData(null, 'create_user', '/private', formData, null);
  uploadFile(file, path);

  redirect('/');
}

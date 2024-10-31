'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signup(formData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('user_email'),
    password: formData.get('user_password'),
  };

  const userData = {
    p_user_firstname: formData.get('user_first_name'),
    p_user_lastname: formData.get('user_last_name'),
    p_user_school_id: formData.get('user_school_id'),
  };

  console.log(data);

  const { data: user_signin_data, error } = await supabase.auth.signUp(data);

  if (error) {
    console.log(error.message);
    redirect('/error');
  }

  userData.p_user_id = user_signin_data.user.id;

  const { error: error2 } = await supabase.rpc('create_user', userData);

  if (error2) {
    console.log(error2.message);
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/private');
}

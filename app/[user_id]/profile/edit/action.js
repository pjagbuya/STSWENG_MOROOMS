'use server';

import { createClient } from '../../../../utils/supabase/server';
import { convertToNull } from '@/utils/utils';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getUserInfo(uuid) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_user_by_id', {
    p_user_id: uuid,
  });

  if (error) {
    console.error(error);
    redirect('/error');
  }

  console.log(data);
  return data;
}

export async function updateUserInfo(userId, formData) {
  const supabase = createClient();
  const rawFormData = Object.fromEntries(formData);

  const userInfo = {
    p_user_firstname: convertToNull(rawFormData.user_firstname),
    p_user_lastname: convertToNull(rawFormData.user_lastname),
    p_user_school_id: convertToNull(rawFormData.user_school_id),
    p_user_id: userId,
  };

  console.log(userInfo);
  const { error } = await supabase.rpc('update_user', userInfo);

  if (error) {
    console.error(error);
    redirect('/error');
  }

  revalidatePath(`/${userId}/profile`);
  redirect(`/${userId}/profile`);
}

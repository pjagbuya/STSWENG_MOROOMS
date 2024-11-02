'use server';

import { createClient } from '../../../../utils/supabase/server';
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

'use server';

import { createClient } from '@/utils/supabase/server';
import { convertKeysToCamelCase } from '@/utils/utils';

export async function getCurrentUserInfo() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user.id;
  const { data, error } = await supabase.rpc('get_user_by_id', {
    p_user_id: userId,
  });
  if (error) {
    console.error(error.message);
  }

  return convertKeysToCamelCase(data)[0];
}

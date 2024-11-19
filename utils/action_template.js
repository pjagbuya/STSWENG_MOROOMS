'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function callFunctionWithFormData(
  id,
  function_name,
  url,
  formData,
  idColumnName = 'user_id',
) {
  const supabase = createClient();
  const rawFormData = Object.fromEntries(formData);

  const userInfo = {};

  if (idColumnName && id) {
    userInfo['p_' + idColumnName] = id;
  }

  for (const [key, value] of Object.entries(rawFormData)) {
    const snakeCaseKey = 'p_' + key.replace(/([A-Z])/g, '_$1').toLowerCase();
    userInfo[snakeCaseKey] = value;
  }

  const { error } = await supabase.rpc(function_name, userInfo);

  if (error) {
    console.error(error);
    // redirect('/error');
  }

  if (url) {
    revalidatePath(url);
  }
}

export async function callFunctionWithNoFormData(data, function_name, url) {
  const supabase = createClient();

  const { error } = await supabase.rpc(function_name, data);

  if (error) {
    console.error(error.message);
    return error;
  }

  revalidatePath(url);
  return null;
}

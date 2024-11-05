import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function callFunctionWithFormData(
  userId,
  function_name,
  url,
  formData,
) {
  const supabase = createClient();
  const rawFormData = Object.fromEntries(formData);

  const userInfo = {
    p_user_id: userId,
  };

  for (const [key, value] of Object.entries(rawFormData)) {
    userInfo[`p_${key.toLowerCase()}`] = convertToNull(value);
  }

  console.log(userInfo);
  const { error } = await supabase.rpc(function_name, userInfo);

  if (error) {
    console.error(error);
    redirect('/error');
  }

  revalidatePath(url);
}

export async function callFunctionWithNoFormData(data, function_name, url) {
  const supabase = createClient();

  const { error } = await supabase.rpc(function_name, data);

  if (error) {
    console.error(error.message);
  }

  revalidatePath(url);
}

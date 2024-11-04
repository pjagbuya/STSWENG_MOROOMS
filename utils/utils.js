import { createClient as createClientServerSide } from './supabase/server';

export const convertToNull = value =>
  value === undefined || value === '' ? null : value;

export async function IsAdminServerSide() {
  const supabase = createClientServerSide();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.rpc('get_user_role', {
    p_user_id: user.id,
  });

  if (error) {
    throw new Error(error);
  }

  return data.toLowerCase() == 'admin';
}

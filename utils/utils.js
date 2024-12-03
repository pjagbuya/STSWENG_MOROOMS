import { createClient as createClientClientSide } from './supabase/client';
import { createClient as createClientServerSide } from './supabase/server';

export const convertToNull = value =>
  value === undefined || value === '' ? null : value;

export async function isAdminClientSide() {
  const supabase = createClientClientSide();
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

export async function isAdminServerSide() {
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

export function convertKeysToCamelCase(data) {
  return data.map(obj => {
    const newObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Convert snake_case to camelCase
        const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) =>
          letter.toUpperCase(),
        );
        newObj[camelCaseKey] = obj[key];
      }
    }
    return newObj;
  });
}

export function objectToFormData(obj) {
  const formData = new FormData();
  for (const key in obj) {
    console.log(key, obj[key]);
    formData.append(key, obj[key]);
  }
  return formData;
}

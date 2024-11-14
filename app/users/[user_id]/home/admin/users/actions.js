'use server';

import {
  callFunctionWithFormData,
  callFunctionWithNoFormData,
} from '@/utils/action_template';
import { createClient } from '@/utils/supabase/server';
import { convertKeysToCamelCase } from '@/utils/utils';
import { revalidatePath, unstable_noStore } from 'next/cache';

export async function updateUserInfo(userId, url, formData) {
  callFunctionWithFormData(userId, 'update_user', url, formData);
  revalidatePath(url);
}

export async function deleteUser(id, url) {
  callFunctionWithNoFormData({ p_user_id: id }, 'delete_user', url);
}

export async function updateUserRole(userId, role, url) {
  callFunctionWithNoFormData(
    { p_user_id: userId, p_role: role },
    'update_user_role',
    url,
  );
  revalidatePath(url);
}

export async function addRole(userId, url, formData) {
  callFunctionWithFormData(userId, 'add_role', url, formData);
}

export async function updateRole(userId, url, formData) {
  callFunctionWithFormData(userId, 'update_role', url, formData);
}

export async function deleteRole(id, url) {
  callFunctionWithNoFormData({ p_user_id: id }, 'delete_role', url);
}

export async function getUsers() {
  unstable_noStore();
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_all_users');
  if (error) {
    console.error(error.message);
  }

  return convertKeysToCamelCase(data);
}

export async function getRoles() {
  unstable_noStore();
  const supabase = createClient();
  const { data, error } = await supabase.from('role').select();
  if (error) {
    console.error(error.message);
  }

  const roleData = data.map(role => {
    return {
      id: role.role_id,
      value: role.role_name,
    };
  });

  return roleData;
}

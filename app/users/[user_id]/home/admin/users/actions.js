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
  const supabaseAdmin = createClient(true);
  const err = callFunctionWithNoFormData({ p_user_id: id }, 'delete_user', url);
  if (!err) {
    await supabaseAdmin.auth.admin.deleteUser(id);
  }
}

export async function updateUserRole(userId, role, url) {
  callFunctionWithNoFormData(
    { p_user_id: userId, p_role: role },
    'update_user_role',
    url,
  );
  revalidatePath(url);
}

export async function addRole(url, formData) {
  callFunctionWithFormData(
    null,
    'create_role_and_permission',
    url,
    formData,
    null,
  );
}

export async function updateRole(userId, url, formData) {
  callFunctionWithFormData(
    userId,
    'update_role_and_permissions',
    url,
    formData,
    'role_id',
  );
}

export async function deleteRole(id, url) {
  callFunctionWithNoFormData(
    { p_role_id: id },
    'delete_role_and_permission',
    url,
  );
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

export async function getRolesWithPermission() {
  unstable_noStore();
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_roles_with_permissions');
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

export async function getApproveTypes() {
  unstable_noStore();
  const supabase = createClient();
  const { data, error } = await supabase.rpc('approve_types');
  if (error) {
    console.error(error.message);
  }

  const roleData = data.map(type => {
    return {
      id: type,
      value: type,
    };
  });

  return roleData;
}

export async function updateUserApprovalType(userId, approveType, url) {
  callFunctionWithNoFormData(
    { p_user_id: userId, p_is_approved: approveType },
    'update_user_approval',
    url,
  );
  revalidatePath(url);
}

export async function getRoleRequests() {
  unstable_noStore();
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_all_role_requests');
  if (error) {
    console.error(error.message);
  }

  return convertKeysToCamelCase(data);
}

export async function approveRoleRequest(roleRequestId, url) {
  callFunctionWithNoFormData(
    { p_role_request_id: roleRequestId },
    'approve_role_request',
    url,
  );
  revalidatePath(url);
}

export async function declineRoleRequest(roleRequestId, url) {
  callFunctionWithNoFormData(
    { p_role_request_id: roleRequestId },
    'decline_role_request',
    url,
  );
  revalidatePath(url);
}

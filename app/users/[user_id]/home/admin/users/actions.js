'use server';

import {
  callFunctionWithFormData,
  callFunctionWithNoFormData,
} from '@/utils/action_template';

export async function updateUserInfo(userId, url, formData) {
  callFunctionWithFormData(userId, 'update_user', url, formData);
}

export async function deleteUser(id, url) {
  callFunctionWithNoFormData({ p_user_id: id }, 'delete_user', url);
}

export async function updateUserRole(userId, url, formData) {
  callFunctionWithFormData(userId, 'update_user_role', url, formData);
}

'use server';

import { callFunctionWithNoFormData } from '@/utils/action_template';
import { redirect } from 'next/navigation';

export async function requestRoleUpgrade(userId, roleId, url) {
  callFunctionWithNoFormData(
    { p_user_id: userId, p_new_role_id: roleId },
    'create_role_upgrade_request',
    url,
  );
  redirect(`/users/${userId}/profile`);
}

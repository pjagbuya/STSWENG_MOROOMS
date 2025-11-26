'use server';

import { callFunctionWithNoFormData } from '@/utils/action_template';
import { APILogger } from '@/utils/logger_actions';
import { redirect } from 'next/navigation';

export async function requestRoleUpgrade(userId, roleId, url) {
  await APILogger.log(
    'ROLE_UPGRADE_REQUEST',
    'RPC-CREATE',
    'role_upgrade_requests',
    userId,
    { requestedRoleId: roleId },
    null,
  );
  callFunctionWithNoFormData(
    { p_user_id: userId, p_new_role_id: roleId },
    'create_role_upgrade_request',
    url,
  );
  redirect(`/users/${userId}/profile`);
}

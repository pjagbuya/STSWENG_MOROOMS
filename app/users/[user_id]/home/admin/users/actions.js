'use server';

import { PERMISSIONS } from '@/lib/rbac-config';
import { checkPermission, getCurrentUser } from '@/lib/server-rbac';
import {
  callFunctionWithFormData,
  callFunctionWithNoFormData,
} from '@/utils/action_template';
import { APILogger } from '@/utils/logger_actions';
import { createClient } from '@/utils/supabase/server';
import { convertKeysToCamelCase } from '@/utils/utils';
import { revalidatePath, unstable_noStore } from 'next/cache';

// --- MUTATION OPERATIONS (Logging Handled by Action Templates + Auth Admin) ---

export async function updateUserInfo(userId, url, formData) {
  // Check permission before proceeding
  const { authorized, error: authError } = await checkPermission(
    PERMISSIONS.USER_UPDATE,
    'updateUserInfo',
  );

  if (!authorized) {
    return {
      error: authError || 'You do not have permission to update user info.',
    };
  }

  // Logging for RPC is assumed to be inside callFunctionWithFormData
  callFunctionWithFormData(userId, 'update_user', url, formData);
  revalidatePath(url, 'page');
}

export async function deleteUser(id, url) {
  // Check permission before proceeding
  const {
    authorized,
    user,
    error: authError,
  } = await checkPermission(PERMISSIONS.USER_DELETE, 'deleteUser');

  if (!authorized) {
    return {
      error: authError || 'You do not have permission to delete users.',
    };
  }

  const supabaseAdmin = createClient(true);

  // Logging for RPC is assumed to be inside callFunctionWithNoFormData
  const err = callFunctionWithNoFormData({ p_user_id: id }, 'delete_user', url);

  if (!err) {
    try {
      // Delete user from Supabase Auth Admin
      const { error: authError } =
        await supabaseAdmin.auth.admin.deleteUser(id);

      if (authError) {
        // console.error('Error deleting user from Auth:', authError);
        // Log Auth Deletion Error
        await APILogger.log(
          'USER_DELETE',
          'AUTH-ADMIN',
          'auth.users',
          user?.id || null,
          { target_user_id: id },
          authError.message,
        );
      }
      // Success log is assumed to be handled by the prior callFunction
    } catch (e) {
      // console.error('Unexpected error during Auth deletion:', e);
      // Log Unexpected Auth Deletion Error
      await APILogger.log(
        'USER_DELETE',
        'AUTH-ADMIN',
        'auth.users',
        user?.id || null,
        { target_user_id: id },
        e.message,
      );
    }
  }
  revalidatePath(url, 'page');
}

export async function updateUserRole(userId, role, url) {
  // Check permission before proceeding
  const { authorized, error: authError } = await checkPermission(
    PERMISSIONS.USER_ROLE_UPDATE,
    'updateUserRole',
  );

  if (!authorized) {
    return {
      error: authError || 'You do not have permission to change user roles.',
    };
  }

  // Logging for RPC is assumed to be inside callFunctionWithNoFormData
  callFunctionWithNoFormData(
    { p_user_id: userId, p_role: role },
    'update_user_role',
    url,
  );
  revalidatePath(url, 'page');
}

export async function addRole(url, formData) {
  // Check permission before proceeding
  const { authorized, error: authError } = await checkPermission(
    PERMISSIONS.ROLE_CREATE,
    'addRole',
  );

  if (!authorized) {
    return {
      error: authError || 'You do not have permission to create roles.',
    };
  }

  // Logging for RPC is assumed to be inside callFunctionWithFormData
  callFunctionWithFormData(
    null,
    'create_role_and_permission',
    url,
    formData,
    null,
  );
  revalidatePath(url, 'page');
}

export async function updateRole(userId, url, formData) {
  // Check permission before proceeding
  const { authorized, error: authError } = await checkPermission(
    PERMISSIONS.ROLE_UPDATE,
    'updateRole',
  );

  if (!authorized) {
    return {
      error: authError || 'You do not have permission to update roles.',
    };
  }

  // Logging for RPC is assumed to be inside callFunctionWithFormData
  callFunctionWithFormData(
    userId,
    'update_role_and_permissions',
    url,
    formData,
    'role_id',
  );
  revalidatePath(url, 'page');
}

export async function deleteRole(id, url) {
  // Check permission before proceeding
  const { authorized, error: authError } = await checkPermission(
    PERMISSIONS.ROLE_DELETE,
    'deleteRole',
  );

  if (!authorized) {
    return {
      error: authError || 'You do not have permission to delete roles.',
    };
  }

  // Logging for RPC is assumed to be inside callFunctionWithNoFormData
  callFunctionWithNoFormData(
    { p_role_id: id },
    'delete_role_and_permission',
    url,
  );
  revalidatePath(url, 'page');
}

export async function updateUserApprovalType(userId, approveType, url) {
  // Check permission before proceeding
  const { authorized, error: authError } = await checkPermission(
    PERMISSIONS.USER_APPROVE,
    'updateUserApprovalType',
  );

  if (!authorized) {
    return {
      error: authError || 'You do not have permission to approve users.',
    };
  }

  // Logging for RPC is assumed to be inside callFunctionWithNoFormData
  callFunctionWithNoFormData(
    { p_user_id: userId, p_is_approved: approveType },
    'update_user_approval',
    url,
  );
  revalidatePath(url, 'page');
}

export async function approveRoleRequest(roleRequestId, url) {
  // Check permission before proceeding
  const { authorized, error: authError } = await checkPermission(
    PERMISSIONS.ROLE_REQUEST_APPROVE,
    'approveRoleRequest',
  );

  if (!authorized) {
    return {
      error:
        authError || 'You do not have permission to approve role requests.',
    };
  }

  // Logging for RPC is assumed to be inside callFunctionWithNoFormData
  callFunctionWithNoFormData(
    { p_role_request_id: roleRequestId },
    'approve_role_request',
    url,
  );
  revalidatePath(url, 'page');
}

export async function declineRoleRequest(roleRequestId, url) {
  // Check permission before proceeding
  const { authorized, error: authError } = await checkPermission(
    PERMISSIONS.ROLE_REQUEST_DECLINE,
    'declineRoleRequest',
  );

  if (!authorized) {
    return {
      error:
        authError || 'You do not have permission to decline role requests.',
    };
  }

  // Logging for RPC is assumed to be inside callFunctionWithNoFormData
  callFunctionWithNoFormData(
    { p_role_request_id: roleRequestId },
    'decline_role_request',
    url,
  );
  revalidatePath(url, 'page');
}

// --- READ OPERATIONS (Logging Errors Only) ---

export async function getUsers() {
  unstable_noStore();
  const supabase = createClient();
  const currentUser = await getCurrentUser();
  const action = 'USER_READ';
  const table = 'users';

  const { data, error } = await supabase.rpc('get_all_users');
  if (error) {
    // console.error(error.message);
    // Log DB Error
    await APILogger.log(
      action,
      'RPC-READ',
      table,
      currentUser?.id || null,
      null,
      error.message,
    );
  }

  return convertKeysToCamelCase(data);
}

export async function getRolesWithPermission() {
  unstable_noStore();
  const supabase = createClient();
  const currentUser = await getCurrentUser();
  const action = 'ROLE_READ';
  const table = 'roles';

  const { data, error } = await supabase.rpc('get_roles_with_permissions');
  if (error) {
    // console.error(error.message);
    // Log DB Error
    await APILogger.log(
      action,
      'RPC-READ',
      table,
      currentUser?.id || null,
      null,
      error.message,
    );
  }

  return convertKeysToCamelCase(data);
}

export async function getRoles() {
  unstable_noStore();
  const supabase = createClient();
  const currentUser = await getCurrentUser();
  const action = 'ROLE_READ';
  const table = 'role';

  const { data, error } = await supabase.from('role').select();
  if (error) {
    // console.error(error.message);
    // Log DB Error
    await APILogger.log(
      action,
      'DB-READ',
      table,
      currentUser?.id || null,
      null,
      error.message,
    );
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
  const currentUser = await getCurrentUser();
  const action = 'CONFIG_READ';
  const table = 'config';

  const { data, error } = await supabase.rpc('approve_types');
  if (error) {
    // console.error(error.message);
    // Log DB Error
    await APILogger.log(
      action,
      'RPC-READ',
      table,
      currentUser?.id || null,
      null,
      error.message,
    );
  }

  const roleData = data.map(type => {
    return {
      id: type,
      value: type,
    };
  });

  return roleData;
}

export async function getRoleRequests() {
  unstable_noStore();
  const supabase = createClient();
  const currentUser = await getCurrentUser();
  const action = 'REQUEST_READ';
  const table = 'role_requests';

  const { data, error } = await supabase.rpc('get_all_role_requests');
  if (error) {
    // console.error(error.message);
    // Log DB Error
    await APILogger.log(
      action,
      'RPC-READ',
      table,
      currentUser?.id || null,
      null,
      error.message,
    );
  }

  return convertKeysToCamelCase(data);
}

export async function getUsersWithProof() {
  unstable_noStore();
  const supabase = createClient();
  const currentUser = await getCurrentUser();
  const action = 'USER_READ';
  const table = 'users';
  const logUserId = currentUser?.id || null;

  try {
    const { data, error } = await supabase.rpc('select_all_users_and_proof');
    if (error) {
      // console.error(error.message);
      // Log DB Error
      await APILogger.log(
        action,
        'RPC-READ',
        table,
        logUserId,
        null,
        error.message,
      );
      return [];
    }

    data.map(user => {
      // NOTE: getPublicUrl is synchronous, so no error to log here unless storage fails internally
      const { data: fileURL } = supabase.storage
        .from('Morooms-file')
        .getPublicUrl(`proof/${user.user_id}/${user.proof}`);
      user.proofURL = fileURL.publicUrl;
      return user;
    });
    // console.log('data', data);

    return convertKeysToCamelCase(data);
  } catch (e) {
    // Log Unexpected Error
    // console.error('Unexpected error in getUsersWithProof:', e);
    await APILogger.log(
      action,
      'UNEXPECTED-ERROR',
      table,
      logUserId,
      null,
      e.message,
    );
    return [];
  }
}

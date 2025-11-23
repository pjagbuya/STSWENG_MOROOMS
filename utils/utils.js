import { createClient as createClientClientSide } from './supabase/client';
import { createClient as createClientServerSide } from './supabase/server';
import {
  isAdmin as checkIsAdmin,
  isRoomManager as checkIsRM,
  getInternalRole,
} from '@/lib/rbac-config';

export const convertToNull = value =>
  value === undefined || value === '' ? null : value;

/**
 * Check if user is admin (Server-side)
 * Enhanced with RBAC integration
 */
export async function isAdminServerSide() {
  const supabase = createClientServerSide(true);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data, error } = await supabase.rpc('get_user_role', {
    p_user_id: user.id,
  });

  if (error) {
    console.error('Error checking admin status:', error);
    return false;
  }

  return data?.toLowerCase() === 'admin';
}

/**
 * Check if user is room manager (Server-side)
 * Enhanced with RBAC integration
 */
export async function isRMServerSide() {
  const supabase = createClientServerSide(true);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data, error } = await supabase.rpc('get_user_role', {
    p_user_id: user.id,
  });

  if (error) {
    console.error('Error checking RM status:', error);
    return false;
  }

  return data?.toLowerCase() === 'room_manager';
}

/**
 * NEW: Get user role from Supabase (Server-side)
 */
export async function getUserRoleServerSide() {
  const supabase = createClientServerSide();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase.rpc('get_user_role', {
    p_user_id: user.id,
  });

  if (error) {
    console.error('Error fetching user role:', error);
    return null;
  }

  // Convert to internal role format
  return getInternalRole(data);
}

/**
 * NEW: Get user with role (Server-side)
 * Returns user object with role included
 */
export async function getUserWithRoleServerSide() {
  const supabase = createClientServerSide();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: roleData, error } = await supabase.rpc('get_user_role', {
    p_user_id: user.id,
  });

  if (error) {
    console.error('Error fetching user role:', error);
    return {
      id: user.id,
      email: user.email,
      role: null,
      metadata: user.user_metadata,
    };
  }

  return {
    id: user.id,
    email: user.email,
    role: getInternalRole(roleData),
    supabaseRole: roleData,
    metadata: user.user_metadata,
  };
}

/**
 * NEW: Check if user is admin or room manager (Server-side)
 */
export async function isAdminOrRMServerSide() {
  const [admin, rm] = await Promise.all([
    isAdminServerSide(),
    isRMServerSide(),
  ]);
  return admin || rm;
}

/**
 * NEW: Get user role (Client-side)
 * Use this in client components with React context
 */
export async function getUserRoleClientSide() {
  const supabase = createClientClientSide();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase.rpc('get_user_role', {
    p_user_id: user.id,
  });

  if (error) {
    console.error('Error fetching user role:', error);
    return null;
  }

  return getInternalRole(data);
}

// export const convertToNull = value =>
//   value === undefined || value === '' ? null : value;

// export async function isAdminServerSide() {
//   const supabase = createClientServerSide();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   const { data, error } = await supabase.rpc('get_user_role', {
//     p_user_id: user.id,
//   });

//   if (error) {
//     throw new Error(error);
//   }

//   return data.toLowerCase() == 'admin';
// }

// export async function isRMServerSide() {
//   const supabase = createClientServerSide();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   const { data, error } = await supabase.rpc('get_user_role', {
//     p_user_id: user.id,
//   });

//   if (error) {
//     throw new Error(error);
//   }

//   return data.toLowerCase() == 'room_manager';
// }

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

/**
 * NEW: Format Supabase error messages
 */
export function formatSupabaseError(error) {
  if (!error) return 'An unknown error occurred';

  if (error.message) {
    // Handle common Supabase errors
    if (error.message.includes('JWT')) {
      return 'Session expired. Please login again.';
    }
    if (error.message.includes('permission')) {
      return 'You do not have permission to perform this action.';
    }
    return error.message;
  }

  return 'An error occurred. Please try again.';
}

/**
 * NEW: Check if user can perform action based on resource ownership
 */
export function canModifyResource(
  user,
  resourceOwnerId,
  adminAndRMAllowed = true,
) {
  if (!user) return false;

  // Admin and RM can modify any resource (if allowed)
  if (
    adminAndRMAllowed &&
    (user.role === 'ADMIN' || user.role === 'ROOM_MANAGER')
  ) {
    return true;
  }

  // Users can modify their own resources
  return user.id === resourceOwnerId;
}

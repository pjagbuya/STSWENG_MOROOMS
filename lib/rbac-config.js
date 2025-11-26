// rbac-config.js
// Centralized RBAC Policy Configuration (Supabase Integration)
// import { APILogger } from '@/utils/logger_actions';

/**
 * Define all available permissions in the system
 * These should match your Supabase RLS policies and RPC functions
 */
export const PERMISSIONS = {
  // User management
  USER_READ: 'user:read', // get_all_users, get_user_by_id
  USER_CREATE: 'user:create', // create_user
  USER_UPDATE: 'user:update', // update_user, edit_user_by_id
  USER_DELETE: 'user:delete', // delete_user
  USER_APPROVE: 'user:approve', // update_user_approval
  USER_ROLE_UPDATE: 'user:role_update', // update_user_role

  // Role & Permission management
  ROLE_READ: 'role:read', // get_roles_with_permissions
  ROLE_CREATE: 'role:create', // create_role_and_permission
  ROLE_UPDATE: 'role:update', // update_role_and_permissions
  ROLE_DELETE: 'role:delete', // delete_role_and_permission
  ROLE_REQUEST_VIEW: 'role_request:view', // get_all_role_requests
  ROLE_REQUEST_CREATE: 'role_request:create', // create_role_upgrade_request
  ROLE_REQUEST_APPROVE: 'role_request:approve', // approve_role_request
  ROLE_REQUEST_DECLINE: 'role_request:decline', // decline_role_request

  // Room management
  ROOM_READ: 'room:read', // get_all_rooms, get_room_by_id, filter_rooms
  ROOM_CREATE: 'room:create', // create_room
  ROOM_UPDATE: 'room:update', // edit_room
  ROOM_DELETE: 'room:delete', // delete_room

  // Room Type management
  ROOM_TYPE_READ: 'room_type:read', // get_room_types
  ROOM_TYPE_CREATE: 'room_type:create', // create_room_type
  ROOM_TYPE_UPDATE: 'room_type:update', // edit_room_type
  ROOM_TYPE_DELETE: 'room_type:delete', // delete_room_type

  // Room Set management
  ROOM_SET_READ: 'room_set:read', // get_room_sets
  ROOM_SET_CREATE: 'room_set:create', // create_room_set
  ROOM_SET_UPDATE: 'room_set:update', // edit_room_set
  ROOM_SET_DELETE: 'room_set:delete', // delete_room_set

  // Reservation management
  RESERVATION_READ: 'reservation:read', // get_all_reservations, get_reservation_by_id
  RESERVATION_READ_OWN: 'reservation:read_own', // get_reservation_by_user_id
  RESERVATION_CREATE: 'reservation:create', // create_reservation
  RESERVATION_UPDATE: 'reservation:update', // update_reservation
  RESERVATION_DELETE: 'reservation:delete', // delete_reservation
  RESERVATION_APPROVE: 'reservation:approve', // update_reservation_status (approve)
  RESERVATION_DECLINE: 'reservation:decline', // update_reservation_status (decline)

  // Room Schedule management
  ROOM_SCHEDULE_READ: 'room_schedule:read', // get_all_room_schedules, get_room_schedule_by_day
  ROOM_SCHEDULE_CREATE: 'room_schedule:create', // create_room_schedule
  ROOM_SCHEDULE_UPDATE: 'room_schedule:update', // update_room_schedule_by_day

  // Personal Schedule management
  PERSONAL_SCHEDULE_READ: 'personal_schedule:read', // get_user_personal_schedules
  PERSONAL_SCHEDULE_CREATE: 'personal_schedule:create', // create_personal_schedule
  PERSONAL_SCHEDULE_UPDATE: 'personal_schedule:update', // edit_personal_schedule
  PERSONAL_SCHEDULE_DELETE: 'personal_schedule:delete', // delete_personal_schedule

  // Logs & Audit (Admin only)
  LOGS_VIEW: 'logs:view', // View system logs
  LOGS_EXPORT: 'logs:export', // Export logs

  // Dashboard access
  DASHBOARD_ADMIN: 'dashboard:admin',
  DASHBOARD_ROOM_MANAGER: 'dashboard:room_manager',
  DASHBOARD_USER: 'dashboard:user',
};

/**
 * Define all roles and their associated permissions
 * These roles should match your Supabase user_roles table
 */
export const ROLES = {
  ADMIN: {
    name: 'Administrator',
    supabaseRole: 'admin',
    permissions: [
      // Users - Full control
      PERMISSIONS.USER_READ,
      PERMISSIONS.USER_CREATE,
      PERMISSIONS.USER_UPDATE,
      PERMISSIONS.USER_DELETE,
      PERMISSIONS.USER_APPROVE,
      PERMISSIONS.USER_ROLE_UPDATE,

      // Roles - Full control
      PERMISSIONS.ROLE_READ,
      PERMISSIONS.ROLE_CREATE,
      PERMISSIONS.ROLE_UPDATE,
      PERMISSIONS.ROLE_DELETE,
      PERMISSIONS.ROLE_REQUEST_VIEW,
      PERMISSIONS.ROLE_REQUEST_APPROVE,
      PERMISSIONS.ROLE_REQUEST_DECLINE,

      // Rooms - Full control
      PERMISSIONS.ROOM_READ,
      PERMISSIONS.ROOM_CREATE,
      PERMISSIONS.ROOM_UPDATE,
      PERMISSIONS.ROOM_DELETE,

      // Room Types - Full control
      PERMISSIONS.ROOM_TYPE_READ,
      PERMISSIONS.ROOM_TYPE_CREATE,
      PERMISSIONS.ROOM_TYPE_UPDATE,
      PERMISSIONS.ROOM_TYPE_DELETE,

      // Room Sets - Full control
      PERMISSIONS.ROOM_SET_READ,
      PERMISSIONS.ROOM_SET_CREATE,
      PERMISSIONS.ROOM_SET_UPDATE,
      PERMISSIONS.ROOM_SET_DELETE,

      // Reservations - Full control
      PERMISSIONS.RESERVATION_READ,
      PERMISSIONS.RESERVATION_READ_OWN,
      PERMISSIONS.RESERVATION_CREATE,
      PERMISSIONS.RESERVATION_UPDATE,
      PERMISSIONS.RESERVATION_DELETE,
      PERMISSIONS.RESERVATION_APPROVE,
      PERMISSIONS.RESERVATION_DECLINE,

      // Room Schedules - Full control
      PERMISSIONS.ROOM_SCHEDULE_READ,
      PERMISSIONS.ROOM_SCHEDULE_CREATE,
      PERMISSIONS.ROOM_SCHEDULE_UPDATE,

      // Personal Schedules - Full control
      PERMISSIONS.PERSONAL_SCHEDULE_READ,
      PERMISSIONS.PERSONAL_SCHEDULE_CREATE,
      PERMISSIONS.PERSONAL_SCHEDULE_UPDATE,
      PERMISSIONS.PERSONAL_SCHEDULE_DELETE,

      // Logs - Admin only
      PERMISSIONS.LOGS_VIEW,
      PERMISSIONS.LOGS_EXPORT,

      // Dashboard
      PERMISSIONS.DASHBOARD_ADMIN,
    ],
  },

  ROOM_MANAGER: {
    name: 'Room Manager',
    supabaseRole: 'room_manager',
    permissions: [
      // Users - Read only
      PERMISSIONS.USER_READ,

      // NO role management permissions

      // Rooms - Full control (CREATE, READ, UPDATE, DELETE)
      PERMISSIONS.ROOM_READ,
      PERMISSIONS.ROOM_CREATE,
      PERMISSIONS.ROOM_UPDATE,
      PERMISSIONS.ROOM_DELETE,

      // Room Types - Read only
      PERMISSIONS.ROOM_TYPE_READ,
      PERMISSIONS.ROOM_TYPE_CREATE,
      PERMISSIONS.ROOM_TYPE_UPDATE,
      PERMISSIONS.ROOM_TYPE_DELETE,

      // Room Sets - Read only
      PERMISSIONS.ROOM_SET_READ,
      PERMISSIONS.ROOM_SET_CREATE,
      PERMISSIONS.ROOM_SET_UPDATE,
      PERMISSIONS.ROOM_SET_DELETE,

      // Reservations - Can manage and approve
      PERMISSIONS.RESERVATION_READ_OWN,
      PERMISSIONS.RESERVATION_CREATE,
      PERMISSIONS.RESERVATION_UPDATE,
      PERMISSIONS.RESERVATION_DELETE,
      PERMISSIONS.RESERVATION_APPROVE,
      PERMISSIONS.RESERVATION_DECLINE,

      // Room Schedules - Full control
      PERMISSIONS.ROOM_SCHEDULE_READ,
      PERMISSIONS.ROOM_SCHEDULE_CREATE,
      PERMISSIONS.ROOM_SCHEDULE_UPDATE,

      // Personal Schedules - Own only
      PERMISSIONS.PERSONAL_SCHEDULE_READ,
      PERMISSIONS.PERSONAL_SCHEDULE_CREATE,
      PERMISSIONS.PERSONAL_SCHEDULE_UPDATE,
      PERMISSIONS.PERSONAL_SCHEDULE_DELETE,

      // Dashboard
      PERMISSIONS.DASHBOARD_ROOM_MANAGER,
    ],
  },

  USER: {
    name: 'User',
    supabaseRole: 'user',
    permissions: [
      // Users - Can only read (to see other users in system)
      PERMISSIONS.USER_READ,

      // Roles - Can request role upgrade
      PERMISSIONS.ROLE_REQUEST_CREATE,

      // Rooms - Read only (cannot create, update, or delete)
      PERMISSIONS.ROOM_READ,

      // Room Types - Read only
      PERMISSIONS.ROOM_TYPE_READ,

      // Room Sets - Read only
      PERMISSIONS.ROOM_SET_READ,

      // Reservations - Can create and manage own
      PERMISSIONS.RESERVATION_READ_OWN,
      PERMISSIONS.RESERVATION_CREATE,
      PERMISSIONS.RESERVATION_UPDATE, // Own reservations only
      PERMISSIONS.RESERVATION_DELETE, // Own reservations only

      // Room Schedules - Read only
      PERMISSIONS.ROOM_SCHEDULE_READ,

      // Personal Schedules - Full control over own
      PERMISSIONS.PERSONAL_SCHEDULE_READ,
      PERMISSIONS.PERSONAL_SCHEDULE_CREATE,
      PERMISSIONS.PERSONAL_SCHEDULE_UPDATE,
      PERMISSIONS.PERSONAL_SCHEDULE_DELETE,

      // NO logs viewing permission

      // Dashboard
      PERMISSIONS.DASHBOARD_USER,
    ],
  },

  GUEST: {
    name: 'Guest',
    supabaseRole: 'guest',
    permissions: [
      // Rooms - Read only
      PERMISSIONS.ROOM_READ,
    ],
  },
};

/**
 * Map Supabase role names to internal role keys
 */
export const SUPABASE_ROLE_MAP = {
  admin: 'ADMIN',
  room_manager: 'ROOM_MANAGER',
  user: 'USER',
  guest: 'GUEST',
};

/**
 * Convert Supabase role to internal role key (case-insensitive)
 */
export const getInternalRole = supabaseRole => {
  if (!supabaseRole) return null;

  // Normalize: lowercase and replace spaces with underscores
  const normalized = supabaseRole.toLowerCase().replace(/\s+/g, '_');

  // console.log(
  //   '🔍 Converting role:',
  //   supabaseRole,
  //   '→',
  //   normalized,
  //   '→',
  //   SUPABASE_ROLE_MAP[normalized],
  // );

  return SUPABASE_ROLE_MAP[normalized] || null;
};
/**
 * Define resource-level permissions
 */
export const RESOURCE_RULES = {
  // Users can only update their own reservations unless they're admin/room_manager
  canUpdateReservation: (user, reservationUserId) => {
    if (!hasPermission(user, PERMISSIONS.RESERVATION_UPDATE)) return false;

    // Admin and Room Manager can update any reservation
    if (user.role === 'ADMIN' || user.role === 'ROOM_MANAGER') return true;

    // Regular users can only update their own reservations
    return user.id === reservationUserId;
  },

  // Only Admin and Room Manager can approve reservations
  canApproveReservation: user => {
    return hasPermission(user, PERMISSIONS.RESERVATION_APPROVE);
  },

  // Users can delete their own reservations, Admin/RM can delete any
  canDeleteReservation: (user, reservationUserId, reservationStatus) => {
    if (!hasPermission(user, PERMISSIONS.RESERVATION_DELETE)) return false;

    // Admin and Room Manager can delete any reservation
    if (user.role === 'ADMIN' || user.role === 'ROOM_MANAGER') return true;

    // Regular users can only delete their own pending reservations
    return user.id === reservationUserId && reservationStatus === 'pending';
  },

  // Only Admin can approve users
  canApproveUser: user => {
    return hasPermission(user, PERMISSIONS.USER_APPROVE);
  },

  // Only Admin can change user roles
  canChangeUserRole: user => {
    return hasPermission(user, PERMISSIONS.USER_ROLE_UPDATE);
  },

  // Only Admin can approve role requests
  canApproveRoleRequest: user => {
    return hasPermission(user, PERMISSIONS.ROLE_REQUEST_APPROVE);
  },

  // Users can only view their own personal schedules unless admin/RM
  canViewPersonalSchedule: (user, scheduleUserId) => {
    if (!hasPermission(user, PERMISSIONS.PERSONAL_SCHEDULE_READ)) return false;

    // Admin and RM can view any schedule
    if (user.role === 'ADMIN' || user.role === 'ROOM_MANAGER') return true;

    // Users can only view their own schedules
    return user.id === scheduleUserId;
  },

  // Users can only modify their own personal schedules
  canModifyPersonalSchedule: (user, scheduleUserId) => {
    if (!hasPermission(user, PERMISSIONS.PERSONAL_SCHEDULE_UPDATE))
      return false;

    // Even admin/RM follow this rule - only owner can modify
    return user.id === scheduleUserId;
  },
};

export const hasPermission = (user, permission) => {
  if (!user || !user.role) return false;
  const role = ROLES[user.role];
  if (!role) {
    // APILogger.log(
    //   'rbac_check',
    //   'PERMISSION_CHECK',
    //   'rbac-config',
    //   user.id,
    //   { userRole: user.role, permission },
    //   'Role not found',
    // );
    return false;
  }

  const hasPerm = role.permissions.includes(permission);
  // APILogger.log(
  //   'rbac_check',
  //   'PERMISSION_CHECK',
  //   'rbac-config',
  //   user.id,
  //   { userRole: user.role, permission },
  //   hasPerm ? null : 'Unauthorized Access from User',
  // );

  return role.permissions.includes(permission);
};

export const hasAnyPermission = (user, permissions) => {
  return permissions.some(permission => hasPermission(user, permission));
};

export const hasAllPermissions = (user, permissions) => {
  return permissions.every(permission => hasPermission(user, permission));
};

export const getUserPermissions = user => {
  if (!user || !user.role) return [];
  const role = ROLES[user.role];
  return role ? role.permissions : [];
};

export const isAdmin = user => user?.role === 'ADMIN';
export const isRoomManager = user => user?.role === 'ROOM_MANAGER';
export const isAdminOrRM = user =>
  user?.role === 'ADMIN' || user?.role === 'ROOM_MANAGER';

'use server';

import { PERMISSIONS } from '@/lib/rbac-config';
import { checkPermission } from '@/lib/server-rbac';
import { APILogger } from '@/utils/logger_actions';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Adds a new room type with the provided details.
 *
 * @async
 * @function addRoomType
 * @param {string} name - The name of the room type.
 * @param {string} details - Additional details or description of the room type.
 * @param {number} capacity - The maximum capacity of the room type.
 * @param {number} minReserveTime - The minimum reservation time (in minutes).
 * @param {number} maxReserveTime - The maximum reservation time (in minutes).
 * @returns {Promise<Error|void>} Resolves to void if successful or an error object if an error occurs.
 */
export async function addRoomType(
  name,
  details,
  capacity,
  minReserveTime,
  maxReserveTime,
) {
  // Check permission before proceeding
  const {
    authorized,
    user,
    error: authError,
  } = await checkPermission(PERMISSIONS.ROOM_TYPE_CREATE, 'addRoomType');

  if (!authorized) {
    return {
      message: authError || 'You do not have permission to create room types.',
    };
  }

  const supabase = createClient();
  const userId = user?.id || null;

  const { error } = await supabase.rpc('create_room_type', {
    p_name: name,
    p_details: details,
    p_capacity: capacity,
    p_min_reservation_time: minReserveTime,
    p_max_reservation_time: maxReserveTime,
  });

  if (error) {
    await APILogger.log(
      'addRoomType',
      'POST',
      'room_types',
      userId,
      { name, details, capacity, minReserveTime, maxReserveTime },
      error.message,
    );
    return error;
  }
  await APILogger.log(
    'addRoomType',
    'POST',
    'room_types',
    userId,
    { name, details, capacity, minReserveTime, maxReserveTime },
    null,
  );

  revalidatePath('/manage/room_types');
  revalidatePath('/manage/rooms');
}

/**
 * Deletes a room type by its ID.
 *
 * @async
 * @function deleteRoomType
 * @param {number} id - The ID of the room type to delete.
 * @returns {Promise<Error|void>} Resolves to void if successful or an error object if an error occurs.
 */
export async function deleteRoomType(id) {
  // Check permission before proceeding
  const {
    authorized,
    user,
    error: authError,
  } = await checkPermission(PERMISSIONS.ROOM_TYPE_DELETE, 'deleteRoomType');

  if (!authorized) {
    return {
      message: authError || 'You do not have permission to delete room types.',
    };
  }

  const supabase = createClient();
  const userId = user?.id || null;

  const { error } = await supabase.rpc('delete_room_type', {
    p_room_type_id: id,
  });

  if (error) {
    // console.error('Error deleting room type:', error);
    await APILogger.log(
      'deleteRoomType',
      'DELETE',
      'room_types',
      userId,
      { roomTypeId: id },
      error.message,
    );
    return error;
  }
  await APILogger.log(
    'deleteRoomType',
    'DELETE',
    'room_types',
    userId,
    { roomTypeId: id },
    null,
  );
  revalidatePath('/manage/room_types');
}

/**
 * Edits an existing room type's details.
 *
 * @async
 * @function editRoomType
 * @param {number} id - The ID of the room type to edit.
 * @param {string} name - The new name for the room type.
 * @param {string} details - The new details or description for the room type.
 * @param {number} capacity - The new capacity for the room type.
 * @param {number} minReserveTime - The new minimum reservation time (in minutes).
 * @param {number} maxReserveTime - The new maximum reservation time (in minutes).
 * @returns {Promise<Error|void>} Resolves to void if successful or an error object if an error occurs.
 */
export async function editRoomType(
  id,
  name,
  details,
  capacity,
  minReserveTime,
  maxReserveTime,
) {
  // Check permission before proceeding
  const {
    authorized,
    user,
    error: authError,
  } = await checkPermission(PERMISSIONS.ROOM_TYPE_UPDATE, 'editRoomType');

  if (!authorized) {
    return {
      message: authError || 'You do not have permission to edit room types.',
    };
  }

  const supabase = createClient();
  const userId = user?.id || null;

  const { error } = await supabase.rpc('edit_room_type', {
    p_room_type_id: id,
    p_new_name: name,
    p_new_details: details,
    p_capacity: capacity,
    p_min_reservation_time: minReserveTime,
    p_max_reservation_time: maxReserveTime,
  });

  if (error) {
    // console.error('Error editing room type:', error);
    await APILogger.log(
      'editRoomType',
      'PUT',
      'room_types',
      userId,
      {
        roomTypeId: id,
        newName: name,
        newDetails: details,
        newCapacity: capacity,
        newMinReserveTime: minReserveTime,
        newMaxReserveTime: maxReserveTime,
      },
      error.message,
    );
    return error;
  }
  await APILogger.log(
    'editRoomType',
    'PUT',
    'room_types',
    userId,
    {
      roomTypeId: id,
      newName: name,
      newDetails: details,
      newCapacity: capacity,
      newMinReserveTime: minReserveTime,
      newMaxReserveTime: maxReserveTime,
    },
    null,
  );

  revalidatePath('/manage/room_types');
}

/**
 * Fetches all room types.
 *
 * @async
 * @function fetchRoomTypes
 * @returns {Promise<Array<Object>>} Resolves to an array of room type objects or throws an error if the operation fails.
 * @throws Will throw an error if the RPC call fails.
 */
export async function fetchRoomTypes() {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_room_types');

  if (error) {
    // console.error('Error fetching room types:', error);
    await APILogger.log(
      'fetchRoomTypes',
      'RPC-READ',
      'room_types',
      null,
      null,
      error.message,
    );
    throw error;
  }

  return data;
}

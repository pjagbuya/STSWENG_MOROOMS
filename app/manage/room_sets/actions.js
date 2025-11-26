'use server';

import { PERMISSIONS } from '@/lib/rbac-config';
import { checkPermission } from '@/lib/server-rbac';
import { APILogger } from '@/utils/logger_actions';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Adds a new room set using the provided name.
 *
 * @async
 * @function addRoomSet
 * @param {string} name - The name of the new room set.
 * @returns {Promise<Error|void>} Resolves to void if successful or an error object if an error occurs.
 */
export async function addRoomSet(name) {
  // Check permission before proceeding
  const {
    authorized,
    user,
    error: authError,
  } = await checkPermission(PERMISSIONS.ROOM_SET_CREATE, 'addRoomSet');

  if (!authorized) {
    return {
      message: authError || 'You do not have permission to create room sets.',
    };
  }

  const supabase = createClient();
  const userId = user?.id || null;

  const { error } = await supabase.rpc('create_room_set', {
    p_name: name,
  });

  if (error) {
    await APILogger.log(
      'addRoomSet',
      'POST',
      'room_sets',
      userId,
      { name },
      error.message,
    );
    // console.error('Error adding room set:', error);
    return error;
  }
  await APILogger.log(
    'addRoomSet',
    'POST',
    'room_sets',
    userId,
    { name },
    null,
  );

  revalidatePath('/manage/room_sets');
}

/**
 * Deletes a room set by its ID.
 *
 * @async
 * @function deleteRoomSet
 * @param {number} id - The ID of the room set to delete.
 * @returns {Promise<Error|void>} Resolves to void if successful or an error object if an error occurs.
 */
export async function deleteRoomSet(id) {
  // Check permission before proceeding
  const {
    authorized,
    user,
    error: authError,
  } = await checkPermission(PERMISSIONS.ROOM_SET_DELETE, 'deleteRoomSet');

  if (!authorized) {
    return {
      message: authError || 'You do not have permission to delete room sets.',
    };
  }

  const supabase = createClient();
  const userId = user?.id || null;

  const { error } = await supabase.rpc('delete_room_set', {
    p_room_set_id: id,
  });

  if (error) {
    await APILogger.log(
      'deleteRoomSet',
      'DELETE',
      'room_sets',
      userId,
      { roomSetId: id },
      error.message,
    );
    // console.error('Error deleting room set:', error);
    return error;
  }

  await APILogger.log(
    'deleteRoomSet',
    'DELETE',
    'room_sets',
    userId,
    { roomSetId: id },
    null,
  );

  revalidatePath('/manage/room_sets');
}

/**
 * Edits a room set's name by its ID.
 *
 * @async
 * @function editRoomSet
 * @param {number} id - The ID of the room set to edit.
 * @param {string} name - The new name for the room set.
 * @returns {Promise<Error|void>} Resolves to void if successful or an error object if an error occurs.
 */
export async function editRoomSet(id, name) {
  // Check permission before proceeding
  const {
    authorized,
    user,
    error: authError,
  } = await checkPermission(PERMISSIONS.ROOM_SET_UPDATE, 'editRoomSet');

  if (!authorized) {
    return {
      message: authError || 'You do not have permission to edit room sets.',
    };
  }

  const supabase = createClient();
  const userId = user?.id || null;

  const { error } = await supabase.rpc('edit_room_set', {
    p_room_set_id: id,
    p_new_name: name,
  });

  if (error) {
    await APILogger.log(
      'editRoomSet',
      'PUT',
      'room_sets',
      userId,
      { roomSetId: id, newName: name },
      error.message,
    );
    // console.error('Error editing room set:', error);
    return error;
  }
  await APILogger.log(
    'editRoomSet',
    'PUT',
    'room_sets',
    userId,
    { roomSetId: id, newName: name },
    null,
  );

  revalidatePath('/manage/room_sets');
  revalidatePath('/manage/rooms');
}

/**
 * Fetches all room sets.
 *N
 * @async
 * @function fetchRoomSets
 * @returns {Promise<Array<Object>>} Resolves to an array of room set objects or throws an error if the operation fails.
 * @throws Will throw an error if the RPC call fails.
 */
export async function fetchRoomSets() {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_room_sets');

  if (error) {
    throw error;
  }

  return data;
}

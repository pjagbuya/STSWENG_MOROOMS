'use server';

import { createClient } from '@/utils/supabase/client';
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
  const supabase = createClient();

  const { error } = await supabase.rpc('create_room_type', {
    p_name: name,
    p_details: details,
    p_capacity: capacity,
    p_min_reservation_time: minReserveTime,
    p_max_reservation_time: maxReserveTime,
  });

  if (error) {
    console.error('Error adding room type:', error);
    return error;
  }

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
  const supabase = createClient();

  const { error } = await supabase.rpc('delete_room_type', {
    p_room_type_id: id,
  });

  if (error) {
    console.error('Error deleting room type:', error);
    return error;
  }

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
  const supabase = createClient();

  const { error } = await supabase.rpc('edit_room_type', {
    p_room_type_id: id,
    p_new_name: name,
    p_new_details: details,
    p_capacity: capacity,
    p_min_reservation_time: minReserveTime,
    p_max_reservation_time: maxReserveTime,
  });

  if (error) {
    console.error('Error editing room type:', error);
    return error;
  }

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
    console.error('Error fetching room types:', error);
    throw error;
  }

  return data;
}

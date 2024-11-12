'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addRoom(name, details, roomTypeId, roomSetId) {
  const supabase = createClient();

  const { error } = await supabase.rpc('create_room', {
    p_room_name: name,
    p_room_details: details,
    p_room_type_id: roomTypeId,
    p_room_set_id: roomSetId,
  });

  if (error) {
    console.error('Error adding room:', error);
    return error;
  }
}

export async function addRoomAction(name, details, roomTypeId, roomSetId) {
  const err = await addRoom(name, details, roomTypeId, roomSetId);
  revalidatePath('/rooms');
  return err;
}

export async function deleteRoom(id) {
  const supabase = createClient();

  const { error } = await supabase.rpc('delete_room', {
    p_room_id: id,
  });

  if (error) {
    console.error('Error deleting room:', error);
    return error;
  }
}

export async function deleteRoomAction(id) {
  await deleteRoom(id);
  revalidatePath('/rooms');
}

export async function editRoom(id, name, details, roomTypeId, roomSetId) {
  const supabase = createClient();

  const { error } = await supabase.rpc('edit_room', {
    p_room_id: id,
    p_new_name: name,
    p_new_details: details,
    p_new_type_id: roomTypeId,
    p_new_set_id: roomSetId,
  });

  if (error) {
    console.error('Error editing room:', error);
    return error;
  }
}

export async function editRoomAction(id, name, details, roomTypeId, roomSetId) {
  const err = await editRoom(id, name, details, roomTypeId, roomSetId);
  revalidatePath('/rooms');
  return err;
}

export async function filterRooms(filter) {
  const supabase = createClient();

  console.log(filter);

  const { data, error } = await supabase.rpc('filter_rooms', {
    p_name: filter.name,
    p_date_time_range: `{[${filter.date} ${filter.startTime}, ${filter.date} ${filter.endTime})}`,
    p_room_set_id: filter.roomSetId,
    // p_min_capacity: filter.minCapacity,
  });

  if (error) {
    console.error('Error fetching room types:', error);
    throw error;
  }

  return data;
}

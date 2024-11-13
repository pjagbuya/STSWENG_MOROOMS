'use server';

import { createClient } from '@/utils/supabase/client';
import { revalidatePath } from 'next/cache';

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
}

export async function addRoomTypeAction(
  name,
  details,
  capacity,
  minReserveTime,
  maxReserveTime,
) {
  const err = await addRoomType(
    name,
    details,
    capacity,
    minReserveTime,
    maxReserveTime,
  );
  revalidatePath('/manage/room_types');
  revalidatePath('/manage/rooms');
  return err;
}

export async function deleteRoomType(id) {
  const supabase = createClient();

  const { error } = await supabase.rpc('delete_room_type', {
    p_room_type_id: id,
  });

  if (error) {
    console.error('Error deleting room type:', error);
    return error;
  }
}

export async function deleteRoomTypeAction(id) {
  await deleteRoomType(id);
  revalidatePath('/manage/room_types');
}

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
}

export async function editRoomTypeAction(
  id,
  name,
  details,
  capacity,
  minReserveTime,
  maxReserveTime,
) {
  const err = await editRoomType(
    id,
    name,
    details,
    capacity,
    minReserveTime,
    maxReserveTime,
  );
  revalidatePath('/manage/room_types');
  return err;
}

export async function fetchRoomTypes() {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_room_types');

  if (error) {
    console.error('Error fetching room types:', error);
    throw error;
  }

  return data;
}

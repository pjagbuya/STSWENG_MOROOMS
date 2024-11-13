'use server';

import { createClient } from '@/utils/supabase/client';
import { revalidatePath } from 'next/cache';

export async function addRoomSet(name) {
  const supabase = createClient();

  const { error } = await supabase.rpc('create_room_set', {
    p_name: name,
  });

  if (error) {
    console.error('Error adding room set:', error);
    return error;
  }
}

export async function addRoomSetAction(name, details) {
  const err = await addRoomSet(name, details);
  revalidatePath('/manage/room_sets');
  return err;
}

export async function deleteRoomSet(id) {
  const supabase = createClient();

  const { error } = await supabase.rpc('delete_room_set', {
    p_room_set_id: id,
  });

  if (error) {
    console.error('Error deleting room set:', error);
    return error;
  }
}

export async function deleteRoomSetAction(id) {
  await deleteRoomSet(id);
  revalidatePath('/manage/room_sets');
}

export async function editRoomSet(id, name) {
  const supabase = createClient();

  const { error } = await supabase.rpc('edit_room_set', {
    p_room_set_id: id,
    p_new_name: name,
  });

  if (error) {
    console.error('Error editing room set:', error);
    return error;
  }
}

export async function editRoomSetAction(id, name) {
  const err = await editRoomSet(id, name);
  revalidatePath('/manage/room_sets');
  revalidatePath('/manage/rooms');
  return err;
}

export async function fetchRoomSets() {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_room_sets');

  if (error) {
    console.error('Error fetching room sets:', error);
    throw error;
  }

  return data;
}

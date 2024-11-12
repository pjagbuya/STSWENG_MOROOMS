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
    return { ...error, field: 'name' };
  }
}

export async function addRoomAction(name, details, roomTypeId, roomSetId) {
  const err = await addRoom(name, details, roomTypeId, roomSetId);
  revalidatePath('/rooms');
  return err;
}

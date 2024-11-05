'use server';

import { FORM_SCHEMA } from './form_schema';
import { createClient } from '@/utils/supabase/client';
import { revalidatePath } from 'next/cache';

export async function addRoomType(name, details) {
  const supabase = createClient();

  const { error } = await supabase.rpc('create_room_type', {
    p_name: name,
    p_details: details,
  });

  if (error) {
    console.error('Error adding room type:', error);
    throw error;
  }
}

export async function addRoomTypeAction(prevState, formData) {
  const parse = FORM_SCHEMA.safeParse({
    name: formData.get('name'),
    details: formData.get('details'),
  });

  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
    };
  }

  const { data } = parse;

  try {
    await addRoomType(data.name, data.details);
  } catch (e) {
    return {
      errors: { name: [e.message] },
    };
  }

  revalidatePath('/manage/room_types');
  return {};
}

export async function deleteRoomType(id) {
  console.log(123);

  const supabase = createClient();

  const { error } = await supabase.rpc('delete_room_type', {
    p_room_type_id: id,
  });

  if (error) {
    console.error('Error deleting room type:', error);
    throw error;
  }
}

export async function deleteRoomTypeAction(id) {
  await deleteRoomType(id);
  revalidatePath('/manage/room_types');
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

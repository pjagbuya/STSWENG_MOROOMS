'use server';

import { FORM_SCHEMA } from './form_schema';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

const BUCKET_URL =
  'https://rcfzezkhwvgtwpqcyhac.supabase.co/storage/v1/object/public/Morooms-file';

export async function addRoomAction(prevState, formData) {
  const supabase = createClient();

  const parseResult = FORM_SCHEMA.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parseResult.success) {
    console.error('Validation error:', parseResult.error);

    return {
      status: 'error',
      error: { message: parseResult.error.message },
    };
  }

  const { data: roomID, error: roomCreateError } = await supabase.rpc(
    'create_room',
    {
      p_room_name: formData.get('name'),
      p_room_details: formData.get('details'),
      p_room_image: '',
      p_room_type_id: formData.get('room_type_id'),
      p_room_set_id: formData.get('room_set_id'),
    },
  );

  if (roomCreateError) {
    console.error('Error adding room:', roomCreateError);
    return {
      status: 'error',
      error: roomCreateError,
    };
  }

  const imageFile = formData.get('image_file');

  if (!imageFile) {
    revalidatePath('/rooms');

    return {
      status: 'success',
    };
  }

  const fileExtension = imageFile.type.split('/')[1];
  const imgUrl = `/room_images/${roomID}.${fileExtension}`;

  const { error: imgUploadError } = await supabase.storage
    .from('Morooms-file')
    .upload(imgUrl, imageFile, {
      cacheControl: '3600',
      upsert: false,
    });

  if (imgUploadError) {
    console.error('Error uploading room image:', imgUploadError);
    return {
      status: 'error',
      error: imgUploadError,
    };
  }

  const { error: roomImgAddError } = await supabase.rpc('edit_room', {
    p_room_id: roomID,
    p_new_image: `${BUCKET_URL}${imgUrl}`,
  });

  if (roomImgAddError) {
    console.error('Error setting room image:', roomImgAddError);
    return {
      status: 'error',
      error: roomImgAddError,
    };
  }

  revalidatePath('/rooms');

  return {
    status: 'success',
  };
}

export async function deleteRoomAction(id) {
  const supabase = createClient();

  const { data } = await supabase.rpc('get_room_by_id', {
    p_room_id: id,
  });

  const room_image = data[0].room_image;
  const fileExtension = room_image.split('.').pop();

  const { error: imgDeleteError } = await supabase.storage
    .from('Morooms-file')
    .remove([`room_images/${id}.${fileExtension}`]);

  if (imgDeleteError) {
    console.error('Error deleting room image:', imgUploadError);
    return {
      status: 'error',
      error: imgDeleteError,
    };
  }

  const { error: roomDeleteError } = await supabase.rpc('delete_room', {
    p_room_id: id,
  });

  if (roomDeleteError) {
    console.error('Error deleting room:', error);
    return {
      status: 'error',
      error: roomDeleteError,
    };
  }

  revalidatePath('/rooms');

  return {
    status: 'success',
  };
}

export async function editRoomAction(id, prevState, formData) {
  const supabase = createClient();

  const parseResult = FORM_SCHEMA.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parseResult.success) {
    console.error('Validation error:', parseResult.error);

    return {
      status: 'error',
      error: { message: parseResult.error.message },
    };
  }

  const { error: roomEditError } = await supabase.rpc('edit_room', {
    p_room_id: id,
    p_new_name: formData.get('name'),
    p_new_details: formData.get('details'),
    p_new_type_id: formData.get('room_type_id'),
    p_new_set_id: formData.get('room_set_id'),
  });

  if (roomEditError) {
    console.error('Error editing room:', roomEditError);
    return {
      status: 'error',
      error: roomEditError,
    };
  }

  const imageFile = formData.get('image_file');

  if (!imageFile || imageFile.size === 0) {
    revalidatePath('/rooms');

    return {
      status: 'success',
    };
  }

  const fileExtension = imageFile.type.split('/')[1];
  const imgUrl = `/room_images/${id}.${fileExtension}`;

  const { error: imgDeleteError } = await supabase.storage
    .from('Morooms-file')
    .remove([`room_images/${id}.${fileExtension}`]);

  if (imgDeleteError) {
    console.error('Error updating room image:', imgDeleteError);
    return {
      status: 'error',
      error: imgDeleteError,
    };
  }

  const { error: imgUploadError } = await supabase.storage
    .from('Morooms-file')
    .upload(imgUrl, imageFile, {
      cacheControl: '3600',
      upsert: false,
    });

  if (imgUploadError) {
    console.error('Error updating room image:', imgUploadError);
    return {
      status: 'error',
      error: imgUploadError,
    };
  }

  const { error: roomImgAddError } = await supabase.rpc('edit_room', {
    p_room_id: id,
    p_new_image: `${BUCKET_URL}${imgUrl}`,
  });

  if (roomImgAddError) {
    console.error('Error setting room image:', roomImgAddError);
    return {
      status: 'error',
      error: roomImgAddError,
    };
  }

  revalidatePath('/rooms', 'page');

  return {
    status: 'success',
  };
}

export async function filterRooms(filter) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('filter_rooms', {
    p_name: filter.name,
    p_date_time_range: `{[${filter.date} ${filter.startTime}, ${filter.date} ${filter.endTime})}`,
    p_room_set_id: filter.roomSetId,
    p_min_capacity: filter.minCapacity,
  });

  if (error) {
    console.error('Error fetching room types:', error);
    throw error;
  }

  return data;
}

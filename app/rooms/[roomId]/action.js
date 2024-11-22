'use server';

import {
  convertRangeToNumbers,
  getHourFromRange,
  parseTZDateRanges,
  toTZMultiRange,
} from '@/utils/date_utils';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function reserve(formData) {
  const supabase = createClient();

  console.log('form data in reserve: ', formData); // BUG: FORM DATA DATE RECEIVED IS A DAY OFF??????????

  const selectedDate = new Date(formData.get('selectedDate'));
  const selectedHours = JSON.parse(formData.get('selectedHours')); // Parse the hours from JSON string

  // function to convert the hour data & date data into the proper tzmultirange format
  const formattedDate = toTZMultiRange(selectedDate, selectedHours);

  let endorsementLetterUrl = null;

  // Check if an endorsement letter was uploaded
  const endorsementLetter = formData.get('endorsementLetter');
  if (endorsementLetter && endorsementLetter.size > 0) {
    const fileName = `${formData.get('user_id')}_${Date.now()}_${endorsementLetter.name}`;
    const { data, error: uploadError } = await supabase.storage
      .from('Morooms-file/endorsement_files')
      .upload(fileName, endorsementLetter);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw new Error('Failed to upload endorsement letter');
    }

    // Get the public URL of the uploaded file
    const {
      data: { publicUrl },
      error: urlError,
    } = supabase.storage
      .from('Morooms-file/endorsement_files')
      .getPublicUrl(fileName);

    if (urlError) {
      console.error('Error getting public URL:', urlError);
      throw new Error('Failed to get public URL for endorsement letter');
    }

    endorsementLetterUrl = publicUrl;
  }

  const { error } = await supabase.rpc('create_reservation', {
    p_reservation_time: formattedDate, // TSMULTIRANGE type (range of time stamps)
    p_reservation_name: formData.get('reservation_name'), // VARCHAR
    p_reservation_purpose: formData.get('purpose'), // VARCHAR
    p_reservation_status: 'Pending', // custom ENUM type
    p_reservation_count: formData.get('count'), // INT
    p_reservation_user_id: formData.get('user_id'), // UUID
    p_room_id: formData.get('room_id'), // UUID
    p_reservation_letter: endorsementLetterUrl, // Add the file URL to the reservation
  });

  if (error) {
    console.error('Error creating reservation:', error.message);
    throw new Error('Failed to create reservation');
  }
  console.log('Reservation created successfully');
  revalidatePath('/reservations');
}

export async function get_min_max_room_hours(room_id) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_room_by_id', {
    p_room_id: room_id,
  });

  if (error) {
    console.error('Error fetching room details:', error);
    throw error;
  }

  const { room_type_min_reservation, room_type_max_reservation } = data[0];
  const convertedTimes = getHourFromRange({
    start: room_type_min_reservation,
    end: room_type_max_reservation,
  });

  return convertedTimes;
}

export async function get_room_details(room_id) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_room_by_id', {
    p_room_id: room_id,
  });

  if (error) {
    console.error('Error fetching room details:', error);
    throw error;
  }

  return data[0];
}

export async function get_labelled_room_hours(room_id, reservation_date) {
  const supabase = createClient();
  const formattedDate = reservation_date.toISOString();

  const { data, error } = await supabase.rpc('get_unavailable_reservations', {
    p_room_id: room_id,
    p_reservation_date: formattedDate,
  });

  if (error) {
    console.error('Error fetching reservation details:', error);
    throw error;
  }

  // convert data into an array of times and statuses for that certain day
  const hourStates = {};
  data.forEach(item => {
    const dateRanges = parseTZDateRanges(item.reservation_time);

    const numberRanges = dateRanges.map(range => convertRangeToNumbers(range));
    const status = item.reservation_status;

    numberRanges.forEach(range => {
      let startHour = parseInt(range.start, 10);
      let endHour = parseInt(range.end, 10);

      // If endHour is 0 (12 am the next day), set end hour to 24 (23rd box is included)
      if (endHour === 0) {
        endHour = 24;
      }

      for (let i = startHour; i < endHour; i++) {
        // Iterate over each hour in the range
        hourStates[i] = status.toLowerCase(); // Label the hour with the status
      }
    });
  });

  return hourStates;
}

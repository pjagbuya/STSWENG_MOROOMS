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
  // let endorsementLetterUrl = null;

  // if (formData.endorsementLetter) {
  //   const file = formData.endorsementLetter;
  //   const fileName = `${formData.user_id}-${Date.now()}-${file.name}`;

  //   const { data, error: uploadError } = await supabase.storage
  //     .from('endorsement-letters') // Replace with your actual storage bucket name
  //     .upload(fileName, file);

  //   if (uploadError) {
  //     console.error('Error uploading endorsement letter:', uploadError.message);
  //     return;
  //   }

  //   // Get the public URL of the uploaded file
  //   const { data: urlData } = supabase.storage
  //     .from('endorsement-letters')
  //     .getPublicUrl(fileName);

  //   endorsementLetterUrl = urlData.publicUrl;
  // }

  console.log('form data in reserve: ', formData); // BUG: FORM DATA DATE RECEIVED IS A DAY OFF??????????
  // function to convert the hour data & date data into the proper tzmultirange format

  const formattedDate = toTZMultiRange(
    formData.selectedDate,
    formData.selectedHours,
  );

  const { error } = await supabase.rpc('create_reservation', {
    p_reservation_time: formattedDate, // TSMULTIRANGE type (range of time stamps)
    p_reservation_name: formData.reservation_name, // VARCHAR
    p_reservation_purpose: formData.purpose, // VARCHAR
    p_reservation_status: 'Pending', // custom ENUM type
    p_reservation_count: formData.count, // INT
    p_reservation_user_id: formData.user_id, // UUID
    p_room_id: formData.room_id, // UUID
    p_endorsement_letter_url: formData.endorsementLetterUrl, // Add the file URL to the reservation
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

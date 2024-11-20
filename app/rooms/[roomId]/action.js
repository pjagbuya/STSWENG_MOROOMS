'use server';

import {
  convertRangeToNumbers,
  getHourFromRange,
  parseTZDateRanges,
} from '@/utils/date_utils';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function reserve(formData) {
  const supabase = createClient();
  console.log('form data in reserve: ', formData); // BUG: FORM DATA DATE RECEIVED IS A DAY OFF??????????
  // function to convert the hour data & date data into the proper tzmultirange format
  function toTZMultiRange(date, hours) {
    // Convert the date to a base date at midnight
    console.log('input date tzmulti: ', date);
    const baseDate = new Date(date);
    console.log('base date: ', baseDate);
    baseDate.setUTCHours(0, 0, 0, 0);

    // Helper function to format date and time as "YYYY-MM-DD HH:MM:SS"
    const formatDateTime = dateObj => {
      const year = dateObj.getUTCFullYear();
      const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getUTCDate()).padStart(2, '0');
      const hours = String(dateObj.getUTCHours()).padStart(2, '0');
      const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
      const seconds = String(dateObj.getUTCSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    // Generate each time range based on the selected hours
    const ranges = hours.map(hour => {
      // Create start and end times for each hour
      const startTime = new Date(baseDate);
      startTime.setUTCHours(hour);

      const endTime = new Date(baseDate);
      endTime.setUTCHours(hour + 1);

      // Format the range in the expected format
      return `["${formatDateTime(startTime)}","${formatDateTime(endTime)}")`;
    });

    return `{${ranges.join(', ')}}`;
  }

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
    redirect('/error');
  }
  console.log('Reservation created successfully');
  revalidatePath('/reservations');
}

const extractElements = ranges => {
  return ranges.flat().map(range => {
    return {
      start: range[0],
      end: range[1],
    };
  });
};

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
  console.log(room_type_min_reservation);
  console.log(room_type_max_reservation);
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
  console.log('inputted date: ', reservation_date);
  const formattedDate = reservation_date.toISOString();
  console.log('formatted date:', formattedDate);

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

export async function uploadFile(file) {
  const supabase = createClient();

  const fileName = `${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from('endorsement_files') // Replace with your bucket name
    .upload(`endorsements/${fileName}`, file);

  if (error) {
    console.error('Error uploading file:', error.message);
    throw new Error('File upload failed');
  }

  const { publicUrl } = supabase.storage
    .from('your-bucket-name')
    .getPublicUrl(`endorsements/${fileName}`);

  return publicUrl;
}

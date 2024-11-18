'use server';

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
    return;
  }

  // Reservation created successfully
  console.log('Reservation created successfully');

  // Redirect
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
  console.log(data);

  // Initialize hourStates with all hours as 'available'
  const hourStates = {};
  for (let i = 0; i < 24; i++) {
    hourStates[i] = 'available';

    // TODO: DELETE AFTER
    if (i % 3 === 0) {
      hourStates[i] = 'unavailable';
    } else if (i % 4 === 0) {
      hourStates[i] = 'pending';
    }
  }

  //console.log(hourStates)
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

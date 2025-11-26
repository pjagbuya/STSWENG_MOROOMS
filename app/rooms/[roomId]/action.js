'use server';

import {
  convertRangeToNumbers,
  getHourFromRange,
  parseTZDateRanges,
  toTZMultiRange,
} from '@/utils/date_utils';
import { APILogger } from '@/utils/logger_actions';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function reserve(formData) {
  const supabase = createClient();

  // console.log('form data in reserve: ', formData); // BUG: FORM DATA DATE RECEIVED IS A DAY BEHIND?????????? (click nov 23 on calendar, receive nov 22)

  const selectedDate = new Date(formData.get('selectedDate'));
  selectedDate.setHours(selectedDate.getHours() + 24);
  // console.log('selected date: ', selectedDate);
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
      // console.error('Error uploading file:', uploadError);
      await APILogger.log(
        'uploadEndorsementLetter',
        'STORAGE-UPLOAD',
        'endorsement_files',
        formData.get('user_id'),
        { fileName },
        uploadError,
      );
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
      // console.error('Error getting public URL:', urlError);
      await APILogger.log(
        'uploadEndorsementLetter',
        'STORAGE-GET-PUBLIC-URL',
        'endorsement_files',
        formData.get('user_id'),
        { fileName },
        urlError,
      );
      throw new Error('Failed to get public URL for endorsement letter');
    }

    endorsementLetterUrl = publicUrl;
  }

  const currentDate = new Date().toISOString();

  const { error } = await supabase.rpc('create_reservation', {
    p_reservation_time: formattedDate, // TSMULTIRANGE type (range of time stamps)
    p_reservation_name: formData.get('reservation_name'), // VARCHAR
    p_reservation_purpose: formData.get('purpose'), // VARCHAR
    p_reservation_status: 'Pending', // custom ENUM type
    p_reservation_count: formData.get('count'), // INT
    p_reservation_user_id: formData.get('user_id'), // UUID
    p_room_id: formData.get('room_id'), // UUID
    p_reservation_letter: endorsementLetterUrl, // Add the file URL to the reservation
    p_reservation_request_date: currentDate, // Pass current date and time
  });

  if (error) {
    // console.error('Error creating reservation:', error.message);
    await APILogger.log(
      'createReservation',
      'RPC-MUTATE',
      'reservations',
      formData.get('user_id'),
      { reservationData: Object.fromEntries(formData.entries()) },
      error,
    );
    throw new Error('Failed to create reservation');
  }
  // console.log('Reservation created successfully');
  await APILogger.log(
    'createReservation',
    'RPC-MUTATE',
    'reservations',
    formData.get('user_id'),
    { reservationData: Object.fromEntries(formData.entries()) },
    null,
  );
  revalidatePath('/reservations');
}

export async function get_min_max_room_hours(room_id) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_room_by_id', {
    p_room_id: room_id,
  });

  if (error) {
    // console.error('Error fetching room details:', error);
    await APILogger.log(
      'getMinMaxRoomHours',
      'RPC-READ',
      'rooms',
      null,
      { room_id },
      error,
    );
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
    await APILogger.log(
      'getRoomDetails',
      'RPC-READ',
      'rooms',
      null,
      { room_id },
      error,
    );
    // console.error('Error fetching room details:', error);
    throw error;
  }

  return data[0];
}

export async function get_labelled_room_hours(room_id, _reservation_date) {
  const reservation_date = new Date(_reservation_date);
  reservation_date.setHours(reservation_date.getHours() + 24);

  const supabase = createClient();
  const formattedDate = reservation_date.toISOString();

  const { data, error } = await supabase.rpc('get_unavailable_reservations', {
    p_room_id: room_id,
    p_reservation_date: formattedDate,
  });

  if (error) {
    // console.error('Error fetching reservation details:', error);
    await APILogger.log(
      'getLabelledRoomHours',
      'RPC-READ',
      'rooms',
      null,
      { room_id, reservation_date: formattedDate },
      error,
    );
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

  // Determine the day number from the reservation date
  const dayNumber = (reservation_date.getDay() + 6) % 7;
  // NOTE: current implementation in the db for room schedules is monday = 0, sunday = 6
  // hence the weird preprocessing

  // Fetch room schedule by day
  const { data: scheduleData, error: scheduleError } = await supabase.rpc(
    'get_room_schedule_by_day',
    {
      p_room_id: room_id,
      p_day_number: dayNumber,
    },
  );

  if (scheduleError) {
    // console.error('Error fetching room schedule:', scheduleError);
    await APILogger.log(
      'getLabelledRoomHours',
      'RPC-READ',
      'rooms',
      null,
      { room_id, day_number: dayNumber },
      scheduleError,
    );
    throw scheduleError;
  }

  if (scheduleData) {
    // Parse the schedule ranges and map them to "approved" statuses
    const scheduleRanges = parseTZDateRanges(scheduleData);

    const numberRanges = scheduleRanges.map(range =>
      convertRangeToNumbers(range),
    );
    numberRanges.forEach(range => {
      let startHour = parseInt(range.start, 10);
      let endHour = parseInt(range.end, 10);

      if (endHour === 0) {
        endHour = 24; // Adjust for 12 AM being the next day
      }

      for (let i = startHour; i < endHour; i++) {
        // Only set the hour to 'approved' if it hasn't been labeled already
        if (!hourStates[i]) {
          hourStates[i] = 'approved';
        }
      }
    });
  }

  return hourStates;
}

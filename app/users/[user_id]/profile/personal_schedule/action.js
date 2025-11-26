'use server';

import {
  convertRangeToNumbers,
  flattenScheduleRanges,
  getHourFromRange,
  parseTZDateRanges,
  toTZMultiRange,
} from '@/utils/date_utils';
import { APILogger } from '@/utils/logger_actions';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updatePersonalSchedule(formData) {
  const supabase = createClient();
  const userId = formData.get('user_id');
  const selectedDay = formData.get('selectedDay');
  const selectedHours = JSON.parse(formData.get('selectedHours'));

  // console.log('form data in room_schedule: ', formData);

  try {
    // Step 1: Fetch the current schedule from the database for the specified day and room
    const { data, error } = await supabase.rpc('get_personal_schedule_by_day', {
      p_user_id: userId,
      p_day_number: selectedDay,
    });

    if (error) {
      // console.error('Error fetching current schedule:', error);
      return;
    }

    // console.log('personal schedule data: ', data);

    let updatedSchedule;

    if (!data || data.length === 0) {
      // If no schedule exists, just process the selected hours
      // console.log(
      //   'No existing schedule, using selected hours as the schedule.',
      // );
      const TZSelectedHours = toTZMultiRange(new Date(), selectedHours);
      const parsedTZSelectedHours = parseTZDateRanges(TZSelectedHours);
      updatedSchedule = parsedTZSelectedHours.map(range =>
        convertRangeToNumbers(range),
      );
    } else {
      // Step 2: Fetch and convert the existing schedule into number ranges
      const existingSchedule = parseTZDateRanges(data);
      // console.log('existing schedule: ', existingSchedule);
      const existingScheduleRanges = existingSchedule.map(range =>
        convertRangeToNumbers(range),
      );
      // console.log('existing schedule numbers: ', existingScheduleRanges);

      // Step 3: Convert the selected hours to a number range
      const TZSelectedHours = toTZMultiRange(new Date(), selectedHours);
      // console.log('selected hours formatted: ', TZSelectedHours);
      const parsedTZSelectedHours = parseTZDateRanges(TZSelectedHours);
      const selectedHoursRanges = parsedTZSelectedHours.map(range =>
        convertRangeToNumbers(range),
      );
      // console.log('selected hours range: ', selectedHoursRanges);

      // Step 4: Compare the existingScheduleRanges with selectedHoursRanges and adjust the schedule
      updatedSchedule = [];

      // Remove overlaps from existingScheduleRanges
      existingScheduleRanges.forEach(existingRange => {
        let splitRanges = [existingRange]; // Start with the full existing range

        // For each selected range, adjust the splitRanges to remove overlaps
        selectedHoursRanges.forEach(selectedRange => {
          const newSplitRanges = [];

          splitRanges.forEach(splitRange => {
            if (
              Number(selectedRange.start) >= Number(splitRange.end) || // No overlap (selectedRange is after splitRange)
              Number(selectedRange.end) <= Number(splitRange.start) // No overlap (selectedRange is before splitRange)
            ) {
              newSplitRanges.push(splitRange); // Keep the range as is
            } else {
              // Partial overlap: split the range
              if (Number(splitRange.start) < Number(selectedRange.start)) {
                newSplitRanges.push({
                  start: splitRange.start,
                  end: selectedRange.start,
                });
              }
              if (Number(splitRange.end) > Number(selectedRange.end)) {
                newSplitRanges.push({
                  start: selectedRange.end,
                  end: splitRange.end,
                });
              }
            }
          });

          splitRanges = newSplitRanges; // Update the splitRanges after processing this selectedRange
        });

        updatedSchedule.push(...splitRanges); // Add non-overlapping parts to the updated schedule
      });

      // Add new non-overlapping ranges from selectedHoursRanges
      selectedHoursRanges.forEach(selectedRange => {
        let isCovered = false;
        // Check if the selectedRange is already covered by any range in updatedSchedule
        existingScheduleRanges.forEach(existingRange => {
          if (
            Number(selectedRange.start) >= Number(existingRange.start) &&
            Number(selectedRange.end) <= Number(existingRange.end)
          ) {
            isCovered = true; // The selectedRange is completely covered
          }
          // console.log(isCovered);
        });
        // If it's not covered, add it
        if (!isCovered) {
          updatedSchedule.push(selectedRange);
        }
      });
    }

    // convert to number ranges to array of numbers
    const updatedFlatSchedule = flattenScheduleRanges(updatedSchedule);
    const updatedScheduleTSMultiRange = toTZMultiRange(
      new Date(),
      updatedFlatSchedule,
    ); // database should only contain ranges unavailable

    // Send the data to the database to update the schedule
    const { data: updateData, error: updateError } = await supabase.rpc(
      'update_personal_schedule_by_day',
      {
        p_user_id: userId,
        p_day_number: selectedDay,
        p_new_schedule_time: updatedScheduleTSMultiRange,
      },
    );

    if (updateError) {
      APILogger.log(
        'updatePersonalSchedule',
        'RPC-UPDATE',
        'personal_schedules',
        userId,
        {
          day_number: selectedDay,
          new_schedule_time: updatedScheduleTSMultiRange,
        },
        updateError,
      );
      // console.error('Error updating personal schedule:', updateError);
    } else {
      APILogger.log(
        'updatePersonalSchedule',
        'RPC-UPDATE',
        'personal_schedules',
        userId,
        {
          day_number: selectedDay,
          new_schedule_time: updatedScheduleTSMultiRange,
        },
        null,
      );
      // console.log('Personal schedule updated successfully!');
    }
  } catch (error) {
    APILogger.log(
      'updatePersonalSchedule',
      'RPC-UPDATE',
      'personal_schedules',
      userId,
      {
        day_number: selectedDay,
        new_schedule_time: updatedScheduleTSMultiRange,
      },
      error,
    );
    // console.error('Error updating personal schedule:', error);
  }
}

export async function get_min_max_room_hours(room_id) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_room_by_id', {
    p_room_id: room_id,
  });

  if (error) {
    // console.error('Error fetching room details:', error);
    APILogger.log(
      'getMinMaxRoomHours',
      'RPC-READ',
      'rooms',
      null,
      {
        room_id: room_id,
      },
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
    // console.error('Error fetching room details:', error);
    APILogger.log(
      'getRoomDetails',
      'RPC-READ',
      'rooms',
      null,
      {
        room_id: room_id,
      },
      error,
    );
    throw error;
  }

  return data[0];
}

export async function fetchPersonalSchedule(userId, dayNumber) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_personal_schedule_by_day', {
    p_user_id: userId,
    p_day_number: dayNumber,
  });

  if (error) {
    // console.error('Error fetching personal schedule:', error);
    APILogger.log(
      'fetchPersonalSchedule',
      'RPC-READ',
      'personal_schedules',
      userId,
      {
        day_number: dayNumber,
      },
      error,
    );
    throw error;
  }

  return data; // Expecting tzmultirange string
}

export async function create_personal_schedule(
  userID,
  name,
  room_name,
  day,
  start_time,
  end_time,
) {
  const supabase = createClient();
  const data_schedule = {
    p_user_id: userID,
    p_name: name,
    p_room_id: room_name,
    p_day: day,
    p_start_time: start_time,
    p_end_time: end_time,
  };
  // console.log('data to send: ', data_schedule);

  const { error } = await supabase.rpc(
    'create_personal_schedule',
    data_schedule,
  );

  if (error) {
    // console.error('Error adding personal schedule:', error);
    APILogger.log(
      'createPersonalSchedule',
      'RPC-CREATE',
      'personal_schedules',
      userID,
      {
        name: name,
        room_name: room_name,
        day: day,
        start_time: start_time,
        end_time: end_time,
      },
      error,
    );
    return error;
  }

  revalidatePath('/personal_schedule');
}

export async function get_user_personal_schedules(userID) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_user_personal_schedules', {
    p_user_id: userID,
  });

  if (error) {
    // console.error('Error fetching user personal schedules:', error);
    APILogger.log(
      'getUserPersonalSchedules',
      'RPC-READ',
      'personal_schedules',
      userID,
      {},
      error,
    );
    throw error;
  }

  const rooms = await get_all_rooms();

  const schedulesWithRoomNames = data.map(schedule => {
    const room = rooms.find(room => room.room_id === schedule.room_id);

    // If the room is found, add roomName to the schedule entry
    if (room) {
      schedule.room_name = room.room_name;
    } else {
      schedule.room_name = null;
    }

    return schedule;
  });

  return schedulesWithRoomNames;
}

export async function edit_personal_schedule(
  id,
  name,
  room_id,
  day,
  start_time,
  end_time,
) {
  const supabase = createClient();

  const { error } = await supabase.rpc('edit_personal_schedule', {
    p_schedule_id: id,
    p_new_name: name,
    p_new_room_id: room_id,
    p_new_day: day,
    p_new_start_time: start_time,
    p_new_end_time: end_time,
  });

  if (error) {
    // console.error('Error editing room type:', error);
    APILogger.log(
      'editPersonalSchedule',
      'RPC-UPDATE',
      'personal_schedules',
      id,
      {
        name: name,
        room_id: room_id,
        day: day,
        start_time: start_time,
        end_time: end_time,
      },
      error,
    );
    return error;
  }

  revalidatePath('/personal_schedule');
}

export async function delete_personal_Schedule(id) {
  const supabase = createClient();

  const { error } = await supabase.rpc('delete_personal_schedule', {
    p_personal_schedule_id: id,
  });

  if (error) {
    // console.error('Error deleting personal Schedule type:', error);
    APILogger.log(
      'deletePersonalSchedule',
      'RPC-DELETE',
      'personal_schedules',
      id,
      {},
      error,
    );
    return error;
  }

  revalidatePath('/personal_schedule');
}

export async function get_all_rooms() {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_all_rooms');

  if (error) {
    // console.error('Error fetching room details:', error);
    APILogger.log('getAllRooms', 'RPC-READ', 'rooms', null, {}, error);
    throw error;
  }

  return data;
}

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
import { redirect } from 'next/navigation';

export async function updateRoomSchedule(formData) {
  const supabase = createClient();
  const selectedDay = formData.get('selectedDay');
  const selectedHours = JSON.parse(formData.get('selectedHours'));
  const roomId = formData.get('room_id');

  // console.log('form data in room_schedule: ', formData);

  try {
    // Step 1: Fetch the current schedule from the database for the specified day and room
    const { data, error } = await supabase.rpc('get_room_schedule_by_day', {
      p_room_id: roomId,
      p_day_number: selectedDay,
    });

    if (error) {
      // console.error('Error fetching current schedule:', error);
      return;
    }

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
      const existingScheduleRanges = existingSchedule.map(range =>
        convertRangeToNumbers(range),
      );

      // Step 3: Convert the selected hours to a number range
      const TZSelectedHours = toTZMultiRange(new Date(), selectedHours);
      const parsedTZSelectedHours = parseTZDateRanges(TZSelectedHours);
      const selectedHoursRanges = parsedTZSelectedHours.map(range =>
        convertRangeToNumbers(range),
      );

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
      'update_room_schedule_by_day',
      {
        p_room_id: roomId,
        p_day_number: selectedDay,
        p_new_schedule_time: updatedScheduleTSMultiRange,
      },
    );

    if (updateError) {
      APILogger.log(
        'updateRoomSchedule',
        'RPC-MUTATE',
        'rooms',
        null,
        {
          room_id: roomId,
          day_number: selectedDay,
          new_schedule_time: updatedScheduleTSMultiRange,
        },
        updateError,
      );
      // console.error('Error updating room schedule:', updateError);
    } else {
      APILogger.log(
        'updateRoomSchedule',
        'RPC-MUTATE',
        'rooms',
        null,
        {
          room_id: roomId,
          day_number: selectedDay,
          new_schedule_time: updatedScheduleTSMultiRange,
        },
        null,
      );
      //
      // console.log('Room schedule updated successfully!');
    }
  } catch (error) {
    APILogger.log(
      'updateRoomSchedule',
      'RPC-MUTATE',
      'rooms',
      null,
      {
        room_id: roomId,
        day_number: selectedDay,
        new_schedule_time: updatedScheduleTSMultiRange,
      },
      error,
    );
    // console.error('Error updating room schedule:', error);
  }
}

export async function get_min_max_room_hours(room_id) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_room_by_id', {
    p_room_id: room_id,
  });

  if (error) {
    APILogger.log(
      'getMinMaxRoomHours',
      'RPC-READ',
      'rooms',
      null,
      { room_id },
      error,
    );
    // console.error('Error fetching room details:', error);
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
    APILogger.log(
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

export async function fetchRoomSchedule(roomId, dayNumber) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_room_schedule_by_day', {
    p_room_id: roomId,
    p_day_number: dayNumber,
  });

  if (error) {
    APILogger.log(
      'getLabelledRoomHours',
      'RPC-READ',
      'rooms',
      null,
      { room_id: roomId, day_number: dayNumber },
      error,
    );
    // console.error('Error fetching room schedule:', error);
    throw error;
  }

  return data; // Expecting tzmultirange string
}

'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function reserve(formData) {
  const supabase = createClient();

  // function to convert the hour data & date data into the proper tzmultirange format
  function toTZMultiRange(date, hours) {
    // Convert the date to a base date at midnight
    const baseDate = new Date(date);
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

// 'use server';

// import { createClient } from '@/utils/supabase/server';
// import { revalidatePath } from 'next/cache';

// export async function addRoom(name, details, roomTypeId, roomSetId) {
//   const supabase = createClient();

//   const { error } = await supabase.rpc('create_room', {
//     p_room_name: name,
//     p_room_details: details,
//     p_room_type_id: roomTypeId,
//     p_room_set_id: roomSetId,
//   });

//   if (error) {
//     console.error('Error adding room:', error);
//     return error;
//   }
// }

// export async function addRoomAction(name, details, roomTypeId, roomSetId) {
//   const err = await addRoom(name, details, roomTypeId, roomSetId);
//   revalidatePath('/rooms');
//   return err;
// }

// export async function deleteRoom(id) {
//   const supabase = createClient();

//   const { error } = await supabase.rpc('delete_room', {
//     p_room_id: id,
//   });

//   if (error) {
//     console.error('Error deleting room:', error);
//     return error;
//   }
// }

// export async function deleteRoomAction(id) {
//   await deleteRoom(id);
//   revalidatePath('/rooms');
// }

// export async function editRoom(id, name, details, roomTypeId, roomSetId) {
//   const supabase = createClient();

//   const { error } = await supabase.rpc('edit_room', {
//     p_room_id: id,
//     p_new_name: name,
//     p_new_details: details,
//     p_new_type_id: roomTypeId,
//     p_new_set_id: roomSetId,
//   });

//   if (error) {
//     console.error('Error editing room:', error);
//     return error;
//   }
// }

// export async function editRoomAction(id, name, details, roomTypeId, roomSetId) {
//   const err = await editRoom(id, name, details, roomTypeId, roomSetId);
//   revalidatePath('/rooms');
//   return err;
// }

// export async function filterRooms(filter) {
//   const supabase = createClient();

//   console.log(filter);

//   const { data, error } = await supabase.rpc('filter_rooms', {
//     p_name: filter.name,
//     p_date_time_range: `{[${filter.date} ${filter.startTime}, ${filter.date} ${filter.endTime})}`,
//     p_room_set_id: filter.roomSetId,
//     p_min_capacity: filter.minCapacity,
//   });

//   if (error) {
//     console.error('Error fetching room types:', error);
//     throw error;
//   }

//   return data;
// }

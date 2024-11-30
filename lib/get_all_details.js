import { createClient } from '@/utils/supabase/server';

export async function get_all_room_schedules() {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_all_room_schedules');

  if (error) {
    console.error('Error fetching room schedule details:', error);
    throw error;
  }

  return data;
}

export async function get_all_reservations() {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_all_reservations');

  if (error) {
    console.error('Error fetching reservation details:', error);
    throw error;
  }

  return data;
}

export async function get_all_rooms() {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_all_rooms');

  if (error) {
    console.error('Error fetching room details:', error);
    throw error;
  }

  return data;
}

export async function get_room_sets() {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_room_sets');

  if (error) {
    console.error('Error fetching room set details:', error);
    throw error;
  }

  return data;
}

export async function get_user_personal_schedules(userID) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_user_personal_schedules', {
    p_user_id: userID,
  });

  if (error) {
    console.error('Error fetching user personal schedules:', error);
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

export default async function get_all_details(userID) {
  // get all room reservations
  const reservations = await get_all_reservations();
  // get all room sets
  const room_sets = await get_room_sets();
  // get all rooms
  const rooms = await get_all_rooms();
  // get all room schedules
  const room_schedules = await get_all_room_schedules();
  // get all personal schedule of user
  const personal_schedule = await get_user_personal_schedules(userID);
}

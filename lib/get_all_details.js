import { parseTZDateRanges } from '@/utils/date_utils';
import { createClient } from '@/utils/supabase/server';

// Change from import to require
const { recommenderSystems } = require('./recommender.js');

export async function get_all_room_schedules() {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_all_room_schedules');

  if (error) {
    // console.error('Error fetching room schedule details:', error);
    throw error;
  }

  return data;
}

export async function get_all_reservations() {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_all_reservations');

  if (error) {
    // console.error('Error fetching reservation details:', error);
    throw error;
  }

  return data;
}

export async function get_all_rooms() {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_all_rooms');

  if (error) {
    // console.error('Error fetching room details:', error);
    throw error;
  }

  return data;
}

export async function get_room_types() {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_room_types');

  if (error) {
    // console.error('Error fetching room set details:', error);
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
    // console.error('Error fetching user personal schedules:', error);
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

export async function get_all_details(userID) {
  // get all room reservations
  const reservations_data = await get_all_reservations();
  // get all room sets
  const room_types_data = await get_room_types();
  // get all rooms
  const rooms_data = await get_all_rooms();
  // get all room schedules
  const room_schedules_data = await get_all_room_schedules();
  // get all personal schedule of user
  const personal_schedules_data = await get_user_personal_schedules(userID);

  // for converting reservations
  const transformed_reservations = [];
  reservations_data.forEach(reservation => {
    let times = [];
    if (reservation.reservation_time) {
      const parsed = parseTZDateRanges(reservation.reservation_time);
      times.push(parsed);
    }
    times[0].forEach(time => {
      transformed_reservations.push({
        room: reservation.room_id,
        date: String(time.start).slice(0, 10),
        startTime: Number(String(time.start).slice(11, 13)),
        endTime: Number(String(time.end).slice(11, 13)),
      });
    });
  });

  const transformed_room_types = {};
  room_types_data.forEach(room_type => {
    if (room_type.min_reservation_time !== null) {
      transformed_room_types[room_type.id] = {
        startTime: Number(String(room_type.min_reservation_time).slice(0, 2)),
        endTime: Number(String(room_type.max_reservation_time).slice(0, 2)),
      };
    }
  });

  const transformed_rooms = [];
  rooms_data.forEach(room => {
    transformed_rooms.push({
      room: room.room_id,
      roomSet: room.room_set_id,
      roomType: room.room_type_id,
    });
  });

  const transformed_room_schedules = [];
  room_schedules_data.forEach(room_schedules => {
    if (room_schedules.monday_schedule_time !== null) {
      const parsed = parseTZDateRanges(room_schedules.monday_schedule_time);

      parsed.forEach(time => {
        transformed_room_schedules.push({
          day: 1,
          startTime: Number(String(time.start).slice(11, 13)),
          endTime: Number(String(time.end).slice(11, 13)),
          room: room_schedules.room_id,
        });
      });
    }
    if (room_schedules.tuesday_schedule_time !== null) {
      const parsed = parseTZDateRanges(room_schedules.tuesday_schedule_time);

      parsed.forEach(time => {
        transformed_room_schedules.push({
          day: 2,
          startTime: Number(String(time.start).slice(11, 13)),
          endTime: Number(String(time.end).slice(11, 13)),
          room: room_schedules.room_id,
        });
      });
    }
    if (room_schedules.wednesday_schedule_time !== null) {
      const parsed = parseTZDateRanges(room_schedules.wednesday_schedule_time);

      parsed.forEach(time => {
        transformed_room_schedules.push({
          day: 3,
          startTime: Number(String(time.start).slice(11, 13)),
          endTime: Number(String(time.end).slice(11, 13)),
          room: room_schedules.room_id,
        });
      });
    }
    if (room_schedules.thursday_schedule_time !== null) {
      const parsed = parseTZDateRanges(room_schedules.thursday_schedule_time);

      parsed.forEach(time => {
        transformed_room_schedules.push({
          day: 4,
          startTime: Number(String(time.start).slice(11, 13)),
          endTime: Number(String(time.end).slice(11, 13)),
          room: room_schedules.room_id,
        });
      });
    }
    if (room_schedules.friday_schedule_time !== null) {
      const parsed = parseTZDateRanges(room_schedules.friday_schedule_time);

      parsed.forEach(time => {
        transformed_room_schedules.push({
          day: 5,
          startTime: Number(String(time.start).slice(11, 13)),
          endTime: Number(String(time.end).slice(11, 13)),
          room: room_schedules.room_id,
        });
      });
    }
    if (room_schedules.saturday_schedule_time !== null) {
      const parsed = parseTZDateRanges(room_schedules.saturday_schedule_time);

      parsed.forEach(time => {
        transformed_room_schedules.push({
          day: 6,
          startTime: Number(String(time.start).slice(11, 13)),
          endTime: Number(String(time.end).slice(11, 13)),
          room: room_schedules.room_id,
        });
      });
    }
    if (room_schedules.sunday_schedule_time !== null) {
      const parsed = parseTZDateRanges(room_schedules.sunday_schedule_time);

      parsed.forEach(time => {
        transformed_room_schedules.push({
          day: 7,
          startTime: Number(String(time.start).slice(11, 13)),
          endTime: Number(String(time.end).slice(11, 13)),
          room: room_schedules.room_id,
        });
      });
    }
  });

  const transformed_personal_schedules = [];
  personal_schedules_data.forEach(personal_schedule => {
    let room_set;
    transformed_rooms.forEach(room => {
      if (room.room === personal_schedule.room_id) {
        room_set = room.roomSet;
      }
    });
    transformed_personal_schedules.push({
      day: personal_schedule.day,
      startTime: Number(String(personal_schedule.start_time).slice(0, 2)),
      endTime: Number(String(personal_schedule.end_time).slice(0, 2)),
      roomSet: room_set,
    });
  });

  const recommended_data = await recommenderSystems(
    new Date(),
    transformed_personal_schedules,
    transformed_reservations,
    transformed_rooms,
    transformed_room_types,
    transformed_room_schedules,
  );

  return recommended_data;
}

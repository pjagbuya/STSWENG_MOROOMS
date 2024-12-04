'use server';

import { createClient } from '@/utils/supabase/server';

const supabase = createClient();

export const fetchReservationsByUserId = async userId => {
  try {
    const { data, error } = await supabase.rpc('get_reservation_by_user_id', {
      p_user_id: userId,
    });

    if (error) {
      console.error('Error fetching reservations:', error);
      return [];
    }

    // Map and format data as needed
    return data.map(reservation => ({
      ...reservation,
      reservationTime: reservation.reservation_time, // Format range if needed
      roomName: reservation.room_id,
      status: reservation.reservation_status,
      reservationPurpose: reservation.reservation_purpose,
      reservationCount: reservation.reservation_count,
      endorsementLetter: reservation.endorsement_letter, // Add this field if present
    }));
  } catch (err) {
    console.error('Unexpected error fetching reservations:', err);
    return [];
  }
};

export const fetchAllReservations = async () => {
  try {
    const { data, error } = await supabase.rpc('get_all_reservations');

    if (error) {
      console.error('Error fetching reservations:', error);
      return [];
    }

    // Map and format data as needed
    return data.map(reservation => ({
      ...reservation,
      reservationTime: reservation.reservation_time, // Format range if needed
      roomName: reservation.room_id,
      status: reservation.reservation_status,
      reservationPurpose: reservation.reservation_purpose,
      reservationCount: reservation.reservation_count,
      endorsementLetter: reservation.endorsement_letter, // Add this field if present
    }));
  } catch (err) {
    console.error('Unexpected error fetching reservations:', err);
    return [];
  }
};

export const fetchRoomDetailsByRoomId = async roomId => {
  try {
    const { data, error } = await supabase.rpc('get_room_by_id', {
      p_room_id: roomId,
    });

    if (error) {
      console.error(
        `Error fetching room details for room ID ${roomId}:`,
        error,
      );
      return null;
    }

    if (data && data.length > 0) {
      return data[0]; // Assuming the procedure returns a single row
    }

    console.warn(`Room with ID ${roomId} not found.`);
    return null;
  } catch (err) {
    console.error(
      `Unexpected error fetching room details for room ID ${roomId}:`,
      err,
    );
    return null;
  }
};

export const fetchReservationsWithRoomNames = async (userId, isAdmin) => {
  try {
    // Determine the reservations to fetch based on isAdmin
    const reservations = isAdmin
      ? await fetchAllReservations() // Fetch all reservations if the user is an admin
      : await fetchReservationsByUserId(userId); // Fetch only the user's reservations if not an admin

    // Fetch room names for each reservation
    const reservationsWithRoomNames = await Promise.all(
      reservations.map(async reservation => {
        const roomDetails = await fetchRoomDetailsByRoomId(reservation.room_id);
        return {
          ...reservation,
          roomName: roomDetails ? roomDetails.room_name : 'Unknown Room',
        };
      }),
    );

    return reservationsWithRoomNames;
  } catch (err) {
    console.error('Error fetching reservations with room names:', err);
    return [];
  }
};

export async function updateReservationStatus(reservationId, status) {
  const { data, error } = await supabase.rpc('update_reservation_status', {
    p_reservation_id: reservationId,
    p_reservation_status: status,
  });

  if (error) {
    console.error('Error updating reservation status:', error);
    return { error };
  }

  return { data };
}

export async function deleteReservation(reservationId) {
  const { data, error } = await supabase.rpc('delete_reservation', {
    p_reservation_id: reservationId,
  });

  if (error) {
    console.error('Error deleting reservation:', error);
    return { error };
  }

  return { data };
}

'use server';

import { PERMISSIONS } from '@/lib/rbac-config';
import {
  checkPermission,
  checkResourceRule,
  getCurrentUser,
} from '@/lib/server-rbac';
import { APILogger } from '@/utils/logger_actions';
import { createClient } from '@/utils/supabase/server';

// --- READ OPERATIONS (Logging Errors Only) ---

export const fetchReservationsByUserId = async userId => {
  const supabase = createClient();
  const action = 'RESERVATION_READ';
  const table = 'reservations';
  const method = 'RPC-READ';
  const currentUser = await getCurrentUser();
  const logUserId = currentUser?.id || userId;

  try {
    const { data, error } = await supabase.rpc('get_reservation_by_user_id', {
      p_user_id: userId,
    });

    if (error) {
      // console.error('Error fetching reservations:', error);
      // Log DB Error
      await APILogger.log(
        action,
        method,
        table,
        logUserId,
        { p_user_id: userId },
        error,
      );
      return [];
    }

    // Handle null or empty data
    if (!data || data.length === 0) {
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
    // console.error('Unexpected error fetching reservations:', err);
    // Log Unexpected Error
    await APILogger.log(
      action,
      method,
      table,
      logUserId,
      { p_user_id: userId },
      err,
    );
    return [];
  }
};

export const fetchAllReservations = async () => {
  const supabase = createClient();
  const action = 'RESERVATION_READ';
  const table = 'reservations';
  const method = 'RPC-READ';
  const currentUser = await getCurrentUser();
  const logUserId = currentUser?.id || null;

  try {
    const { data, error } = await supabase.rpc('get_all_reservations');

    if (error) {
      // console.error('Error fetching all reservations:', error);
      // Log DB Error
      await APILogger.log(
        action,
        method,
        table,
        logUserId,
        { context: 'all' },
        error,
      );
      return [];
    }

    // Handle null or empty data
    if (!data || data.length === 0) {
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
    // console.error('Unexpected error fetching all reservations:', err);
    // Log Unexpected Error
    await APILogger.log(
      action,
      method,
      table,
      logUserId,
      { context: 'all' },
      err,
    );
    return [];
  }
};

export const fetchRoomDetailsByRoomId = async roomId => {
  const supabase = createClient();
  const action = 'ROOM_READ'; // Assuming you have a ROOM_READ enum
  const table = 'rooms';
  const method = 'RPC-READ';
  const currentUser = await getCurrentUser();
  const logUserId = currentUser?.id || null;
  const payload = { p_room_id: roomId };

  try {
    const { data, error } = await supabase.rpc('get_room_by_id', payload);

    if (error) {
      // console.error(`Error fetching room details for room ID ${roomId}:`, error);
      // Log DB Error
      await APILogger.log(action, method, table, logUserId, payload, error);
      return null;
    }

    if (data && data.length > 0) {
      return data[0]; // Assuming the procedure returns a single row
    }

    // console.warn(`Room with ID ${roomId} not found.`);
    return null;
  } catch (err) {
    // console.error(`Unexpected error fetching room details for room ID ${roomId}:`, err);
    // Log Unexpected Error
    await APILogger.log(action, method, table, logUserId, payload, err);
    return null;
  }
};

export const fetchReservationsWithRoomNames = async (userId, isAdmin) => {
  // This function orchestrates reads, so logging can be handled by the inner functions.
  // We only log top-level errors here.
  const action = 'RESERVATION_READ_AGGREGATE';
  const table = 'reservations';
  const method = 'AGGREGATE';
  const currentUser = await getCurrentUser();
  const logUserId = currentUser?.id || userId;

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
    // console.error('Error fetching reservations with room names:', err);
    // Log Unexpected Error
    await APILogger.log(
      action,
      method,
      table,
      logUserId,
      { userId, isAdmin },
      err,
    );
    return [];
  }
};

// --- MUTATION OPERATIONS (Logging Success and Errors) ---

export async function updateReservationStatus(reservationId, status) {
  // Check permission for approving/declining reservations
  const permission =
    status === 'approved'
      ? PERMISSIONS.RESERVATION_APPROVE
      : PERMISSIONS.RESERVATION_DECLINE;

  const {
    authorized,
    user,
    error: authError,
  } = await checkPermission(permission, `updateReservationStatus_${status}`);

  if (!authorized) {
    return {
      error: {
        message:
          authError ||
          'You do not have permission to update reservation status.',
      },
    };
  }

  const supabase = createClient();
  const userId = user?.id || 'UNKNOWN';
  const action = 'RESERVATION_UPDATE'; // Matches enum
  const table = 'reservations';
  const method = 'RPC-MUTATE';
  const payload = {
    p_reservation_id: reservationId,
    p_reservation_status: status,
  };

  try {
    const { data, error } = await supabase.rpc(
      'update_reservation_status',
      payload,
    );

    if (error) {
      // console.error('Error updating reservation status:', error);
      // Log DB Error
      await APILogger.log(action, method, table, userId, payload, error);
      return { error };
    }

    // Log Success
    await APILogger.log(action, method, table, userId, payload, null);
    return { data };
  } catch (err) {
    // console.error('Unexpected error updating reservation status:', err);
    // Log Unexpected Error
    await APILogger.log(action, method, table, userId, payload, err);
    return { error: err };
  }
}

export async function deleteReservation(reservationId) {
  // Check permission before proceeding
  const {
    authorized,
    user,
    error: authError,
  } = await checkPermission(
    PERMISSIONS.RESERVATION_DELETE,
    'deleteReservation',
  );

  if (!authorized) {
    return {
      error: {
        message:
          authError || 'You do not have permission to delete reservations.',
      },
    };
  }

  const supabase = createClient();
  const userId = user?.id || 'UNKNOWN';
  const action = 'RESERVATION_DELETE'; // Matches enum
  const table = 'reservations';
  const method = 'RPC-MUTATE';
  const payload = { p_reservation_id: reservationId };

  try {
    const { data, error } = await supabase.rpc('delete_reservation', payload);

    if (error) {
      // Log DB Error
      await APILogger.log(action, method, table, userId, payload, error);
      return { error };
    }

    // Log Success
    await APILogger.log(action, method, table, userId, payload, null);
    return { data };
  } catch (err) {
    // Log Unexpected Error
    await APILogger.log(action, method, table, userId, payload, err);
    return { error: err };
  }
}

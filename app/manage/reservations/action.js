'use server';

import { createClient } from '@/utils/supabase/server';
import { APILogger } from '@/utils/logger_actions';

const supabase = createClient();

// Helper function to simulate getting the user ID for logging admin/system actions
const getLogUserId = (userContextId = 'SYSTEM_UNKNOWN_USER') => {
    // NOTE: This should be replaced with actual logic to get the logged-in user ID (e.g., from cookies or session).
    return userContextId;
};

// --- READ OPERATIONS (Logging Errors Only) ---

export const fetchReservationsByUserId = async userId => {
    const action = 'RESERVATION_READ';
    const table = 'reservations';
    const method = 'RPC-READ';
    const logUserId = getLogUserId(userId);

    try {
        const { data, error } = await supabase.rpc('get_reservation_by_user_id', {
            p_user_id: userId,
        });

        if (error) {
            console.error('Error fetching reservations:', error);
            // Log DB Error
            await APILogger.log(action, method, table, logUserId, { p_user_id: userId }, error);
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
        // Log Unexpected Error
        await APILogger.log(action, method, table, logUserId, { p_user_id: userId }, err);
        return [];
    }
};

export const fetchAllReservations = async () => {
    const action = 'RESERVATION_READ';
    const table = 'reservations';
    const method = 'RPC-READ';
    const logUserId = getLogUserId('ADMIN_READ'); // Assuming admin is reading all

    try {
        const { data, error } = await supabase.rpc('get_all_reservations');

        if (error) {
            console.error('Error fetching all reservations:', error);
            // Log DB Error
            await APILogger.log(action, method, table, logUserId, { context: 'all' }, error);
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
        console.error('Unexpected error fetching all reservations:', err);
        // Log Unexpected Error
        await APILogger.log(action, method, table, logUserId, { context: 'all' }, err);
        return [];
    }
};

export const fetchRoomDetailsByRoomId = async roomId => {
    const action = 'ROOM_READ'; // Assuming you have a ROOM_READ enum
    const table = 'rooms';
    const method = 'RPC-READ';
    const logUserId = getLogUserId('SYSTEM_FETCH'); // System component reading room details
    const payload = { p_room_id: roomId };

    try {
        const { data, error } = await supabase.rpc('get_room_by_id', payload);

        if (error) {
            console.error(`Error fetching room details for room ID ${roomId}:`, error);
            // Log DB Error
            await APILogger.log(action, method, table, logUserId, payload, error);
            return null;
        }

        if (data && data.length > 0) {
            return data[0]; // Assuming the procedure returns a single row
        }

        console.warn(`Room with ID ${roomId} not found.`);
        return null;
    } catch (err) {
        console.error(`Unexpected error fetching room details for room ID ${roomId}:`, err);
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
    const logUserId = getLogUserId(isAdmin ? 'ADMIN_AGGREGATE' : userId);

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
        // Log Unexpected Error
        await APILogger.log(action, method, table, logUserId, { userId, isAdmin }, err);
        return [];
    }
};

// --- MUTATION OPERATIONS (Logging Success and Errors) ---

export async function updateReservationStatus(reservationId, status) {
    const userId = getLogUserId('ADMIN_STATUS_UPDATE'); // Assuming admin/system is changing status
    const action = 'RESERVATION_UPDATE'; // Matches enum
    const table = 'reservations';
    const method = 'RPC-MUTATE';
    const payload = { p_reservation_id: reservationId, p_reservation_status: status };
    
    try {
        const { data, error } = await supabase.rpc('update_reservation_status', payload);

        if (error) {
            console.error('Error updating reservation status:', error);
            // Log DB Error
            await APILogger.log(action, method, table, userId, payload, error);
            return { error };
        }

        // Log Success
        await APILogger.log(action, method, table, userId, payload, null);
        return { data };
    } catch (err) {
        console.error('Unexpected error updating reservation status:', err);
        // Log Unexpected Error
        await APILogger.log(action, method, table, userId, payload, err);
        return { error: err };
    }
}

export async function deleteReservation(reservationId) {
    const userId = getLogUserId('USER_DELETE_RESERVATION'); // Assuming user/system is deleting
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
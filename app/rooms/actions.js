'use server';

import { FORM_SCHEMA } from './form_schema';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { APILogger } from '@/utils/logger_actions';

const BUCKET_URL = process.env.BUCKET_URL;

// Helper function to simulate getting the user ID for logging admin actions
const getLogUserId = () => {
    // NOTE: Replace this with actual user ID derivation (e.g., from an admin session)
    return 'SYSTEM_ADMIN_ROOM_MGMT';
};

/**
 * Executes a Supabase RPC, logs the outcome, and handles errors consistently.
 * * Success logs are created for MUTATE methods. Errors are always logged before throwing.
 * * @param {string} rpcName - The name of the Supabase function to call.
 * @param {Object} params - The parameters for the Supabase function.
 * @param {string} logAction - The ROOM_ACTION enum for logging.
 * @param {string} [method='RPC-MUTATE'] - The method type for logging.
 * @returns {Promise<Object>} The data returned by the RPC, or throws the error.
 */
async function callRoomRpc(rpcName, params, logAction, method = 'RPC-MUTATE') {
    const supabase = createClient();
    const userId = getLogUserId();
    const table = 'rooms';

    const { data, error } = await supabase.rpc(rpcName, params);

    if (error) {
        console.error(`Error in RPC '${rpcName}':`, error);
        // Log DB Error
        await APILogger.log(logAction, method, table, userId, params, error);
        throw error;
    }

    // Log Success for mutations
    if (method.includes('MUTATE')) {
        await APILogger.log(logAction, method, table, userId, { ...params, response: data }, null);
    }
    
    return data;
}

// --- ADD ROOM ACTION (ROOM_CREATE) ---

/**
 * Adds a new room using form data.
 */
export async function addRoomAction(prevState, formData) {
    const supabase = createClient();
    const userId = getLogUserId();
    const action = 'ROOM_CREATE';
    const method = 'RPC-MUTATE';
    const table = 'rooms';
    const payload = Object.fromEntries(formData.entries());

    const parseResult = FORM_SCHEMA.safeParse(payload);

    if (!parseResult.success) {
        console.error('Validation error:', parseResult.error);
        // LOG: Validation Failure (All input validation failures are logged here)
        await APILogger.log(action, method, table, userId, payload, parseResult.error.message);
        return {
            status: 'error',
            // Return field-specific errors for client display
            errors: parseResult.error.flatten().fieldErrors, 
        };
    }

    // 1. Create room entry in DB
    const rpcPayload = {
        p_room_name: formData.get('name'),
        p_room_details: formData.get('details'),
        p_room_image: '', // Will be updated later if image exists
        p_room_type_id: formData.get('room_type_id'),
        p_room_set_id: formData.get('room_set_id'),
    };

    try {
        // RPC call and logging (Success/Error) handled by helper
        const roomID = await callRoomRpc('create_room', rpcPayload, action);

        const imageFile = formData.get('image_file');
        const logData = { roomID, name: rpcPayload.p_room_name, details: rpcPayload.p_room_details };

        if (!imageFile || imageFile.size === 0) {
            // LOG: Success - Room created without image (boundary case)
            await APILogger.log(action, method, table, userId, { ...logData, image_status: 'skipped' }, null); 
            revalidatePath('/rooms');
            return { status: 'success' };
        }

        // 2. Upload image file to storage
        const fileExtension = imageFile.type.split('/')[1];
        const imgUrl = `/room_images/${roomID}.${fileExtension}`;

        const { error: imgUploadError } = await supabase.storage
            .from('Morooms-file')
            .upload(imgUrl, imageFile, {
                cacheControl: '3600',
                upsert: false,
            });

        if (imgUploadError) {
            console.error('Error uploading room image:', imgUploadError);
            // LOG: Storage Upload Failure
            await APILogger.log(action, 'STORAGE-UPLOAD', table, userId, logData, imgUploadError);
            return {
                status: 'error',
                message: 'Failed to upload image.',
                error: imgUploadError,
            };
        }

        // 3. Update DB record with image URL (RPC call and logging handled by helper)
        const newImageUrl = `${BUCKET_URL}${imgUrl}`;
        await callRoomRpc(
            'edit_room',
            { p_room_id: roomID, p_new_image: newImageUrl },
            action
        );

        revalidatePath('/rooms');
        return { status: 'success' };
    } catch (error) {
        // Catch-all for errors thrown by callRoomRpc or storage operations
        if (error && typeof error.status === 'string') return error; 
        
        // LOG: Unexpected top-level error
        await APILogger.log(action, method, table, userId, payload, { message: 'Unexpected top-level error in addRoomAction', error });
        return {
            status: 'error',
            message: 'An unexpected server error occurred.',
            error: error,
        };
    }
}

// --- DELETE ROOM ACTION (ROOM_DELETE) ---

/**
 * Deletes a room and its associated image by room ID.
 */
export async function deleteRoomAction(id) {
    const supabase = createClient();
    const userId = getLogUserId();
    const action = 'ROOM_DELETE';
    const table = 'rooms';
    const method = 'RPC-MUTATE';
    const payload = { p_room_id: id };

    try {
        // Fetch room data (RPC call and error logging handled by helper)
        const roomData = await callRoomRpc('get_room_by_id', payload, action, 'RPC-READ');
        const room_image = roomData[0]?.room_image;

        if (room_image) {
            // 1. Delete image from storage
            const fileExtension = room_image.split('.').pop();
            const storagePath = `room_images/${id}.${fileExtension}`;

            const { error: imgDeleteError } = await supabase.storage
                .from('Morooms-file')
                .remove([storagePath]);

            if (imgDeleteError) {
                console.error('Error deleting room image:', imgDeleteError);
                // LOG: Storage Deletion Failure
                await APILogger.log(action, 'STORAGE-DELETE', table, userId, { ...payload, imagePath: storagePath }, imgDeleteError);
                return { 
                    status: 'error', 
                    message: 'Failed to delete old image.',
                    error: imgDeleteError 
                };
            }
        }

        // 2. Delete room from DB (RPC call and logging handled by helper)
        await callRoomRpc('delete_room', payload, action);

        revalidatePath('/rooms');
        return { status: 'success' };
    } catch (err) {
        // Catch-all for errors thrown by callRoomRpc or storage operations
        if (err && typeof err.status === 'string') return err; 
        
        // LOG: Unexpected top-level error
        await APILogger.log(action, method, table, userId, payload, { message: 'Unexpected top-level error in deleteRoomAction', err });
        return { status: 'error', message: 'An unexpected server error occurred.' };
    }
}

// --- EDIT ROOM ACTION (ROOM_UPDATE) ---

/**
 * Edits an existing room using form data and updates its image if provided.
 */
export async function editRoomAction(id, prevState, formData) {
    const supabase = createClient();
    const userId = getLogUserId();
    const action = 'ROOM_UPDATE';
    const table = 'rooms';
    const method = 'RPC-MUTATE';
    const payload = Object.fromEntries(formData.entries());

    const parseResult = FORM_SCHEMA.safeParse(payload);

    if (!parseResult.success) {
        console.error('Validation error:', parseResult.error);
        // LOG: Validation Failure (All input validation failures are logged here)
        await APILogger.log(action, method, table, userId, { id, ...payload }, parseResult.error.message);
        return { 
            status: 'error', 
            // Return field-specific errors for client display
            errors: parseResult.error.flatten().fieldErrors 
        };
    }

    const rpcPayload = {
        p_room_id: id,
        p_new_name: formData.get('name'),
        p_new_details: formData.get('details'),
        p_new_type_id: formData.get('room_type_id'),
        p_new_set_id: formData.get('room_set_id'),
    };

    try {
        // 1. Edit room details in DB (RPC call and logging handled by helper)
        await callRoomRpc('edit_room', rpcPayload, action);

        const imageFile = formData.get('image_file');

        // Handle image clear/no change logic
        if (!imageFile || imageFile.size === 0) {
            // Fetch room data (RPC call and error logging handled by helper)
            const roomData = await callRoomRpc('get_room_by_id', { p_room_id: id }, action, 'RPC-READ');
            const room_image = roomData[0]?.room_image;

            if (room_image) {
                const fileExtension = room_image.split('.').pop();
                const storagePath = `room_images/${id}.${fileExtension}`;

                // Delete image from storage
                const { error: imgDeleteError } = await supabase.storage
                    .from('Morooms-file')
                    .remove([storagePath]);

                if (imgDeleteError) {
                    console.error('Error deleting room image:', imgDeleteError);
                    // LOG: Storage Deletion Failure
                    await APILogger.log(action, 'STORAGE-DELETE', table, userId, { id, oldPath: storagePath }, imgDeleteError);
                    return { 
                        status: 'error', 
                        message: 'Failed to delete old image during clear.',
                        error: imgDeleteError 
                    };
                }

                // Clear image URL in DB (RPC call and logging handled by helper)
                await callRoomRpc('edit_room', { p_room_id: id, p_new_image: '' }, action);
            }
            
            // LOG: Success - Details updated/cleared, no new image (boundary case)
            await APILogger.log(action, method, table, userId, { id, image_status: 'not_changed/cleared' }, null);
            revalidatePath('/rooms');
            return { status: 'success' };
        }

        // Handle new image upload/update logic
        if (imageFile.name === id) {
             // LOG: Success - Details updated, but image file name didn't change (boundary case)
            await APILogger.log(action, method, table, userId, { id, image_status: 'file_name_matched' }, null);
            revalidatePath('/rooms');
            return { status: 'success' };
        }

        const fileExtension = imageFile.type.split('/')[1];
        const imgUrl = `/room_images/${id}.${fileExtension}`;
        const storagePath = `room_images/${id}.${fileExtension}`;
        const newImageUrl = `${BUCKET_URL}${imgUrl}`;

        // 2a. Delete old image (or file placeholder)
        const { error: imgDeleteError } = await supabase.storage
            .from('Morooms-file')
            .remove([storagePath]);

        if (imgDeleteError) {
            console.error('Error updating room image (removal):', imgDeleteError);
            // LOG: Storage Deletion Failure
            await APILogger.log(action, 'STORAGE-DELETE', table, userId, { id, oldPath: storagePath }, imgDeleteError);
            return { 
                status: 'error', 
                message: 'Failed to remove old image file.',
                error: imgDeleteError 
            };
        }

        // 2b. Upload new image
        const { error: imgUploadError } = await supabase.storage
            .from('Morooms-file')
            .upload(imgUrl, imageFile, {
                cacheControl: '3600',
                upsert: true,
            });

        if (imgUploadError) {
            console.error('Error updating room image (upload):', imgUploadError);
            // LOG: Storage Upload Failure
            await APILogger.log(action, 'STORAGE-UPLOAD', table, userId, { id, newPath: imgUrl }, imgUploadError);
            return { 
                status: 'error', 
                message: 'Failed to upload new image.',
                error: imgUploadError 
            };
        }

        // 3. Update DB record with new image URL (RPC call and logging handled by helper)
        await callRoomRpc('edit_room', { p_room_id: id, p_new_image: newImageUrl }, action);

        revalidatePath('/rooms', 'page');
        return { status: 'success' };
    } catch (error) {
        // Catch-all for errors thrown by callRoomRpc or storage operations
        if (error && typeof error.status === 'string') return error;
        
        // LOG: Unexpected top-level error
        await APILogger.log(action, method, table, userId, rpcPayload, { message: 'Unexpected top-level error in editRoomAction', error });
        return { status: 'error', message: 'An unexpected server error occurred.' };
    }
}

// --- FILTER ROOMS (Read operation: Logging Errors Only) ---

/**
 * Filters rooms based on the provided filter criteria. Empty filter fields
 * ignore the corresponding filter criteria.
 */
export async function filterRooms(filter) {
    const action = 'ROOM_READ';
    
    try {
       
        const data = await callRoomRpc('filter_rooms', {
            p_name: filter.name,
            p_date_time_range: `{[${filter.date} ${filter.startTime}, ${filter.date} ${filter.endTime})}`,
            p_room_set_id: filter.roomSetId,
            p_min_capacity: filter.minCapacity,
        }, action, 'RPC-READ'); 
        
        return data;
    } catch (err) {
        // Error is already logged inside callRoomRpc
        throw err;
    }
}

// --- GET ROOM BY ID (Read operation: Logging Errors Only) ---

export async function getRoomByID(roomID) {
    const action = 'ROOM_READ';
    
    try {
        // RPC call and error logging handled by helper (success logging skipped via 'RPC-READ')
        const data = await callRoomRpc('get_room_by_id', { p_room_id: roomID }, action, 'RPC-READ');
        return data[0];
    } catch (err) {
        // Error is already logged inside callRoomRpc
        throw err;
    }
}
import { z } from 'zod';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
];

export const FORM_SCHEMA = z.object({
  
  
  name: z.string().min(2, {
    message: 'Room name must be at least 2 characters.',
  })
  .max(50, { 
    message: 'Room name cannot exceed 50 characters.',
    }),
  details: z.string().min(0).max(999, {
    message: 'Character limit exceeded. Details cannot exceed 999 characters.'
  }).optional(),
  image_file: z.any(),
  room_type_id: z.string().uuid(),
  room_set_id: z.string().uuid(),
})





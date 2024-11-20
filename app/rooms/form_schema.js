import { z } from 'zod';

export const FORM_SCHEMA = z.object({
  name: z.string().min(2, {
    message: 'Room name must be at least 2 characters.',
  }),
  details: z.string().optional(),
  image_file: z.any(),
  room_type_id: z.string().uuid(),
  room_set_id: z.string().uuid(),
});

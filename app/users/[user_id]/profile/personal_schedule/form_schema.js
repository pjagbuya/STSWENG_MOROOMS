import { z } from 'zod';

export const FORM_SCHEMA = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  room_id: z.string().nonempty({
    message: 'Please select a room.',
  }),
  day: z.number().int().gte(0, {
    message: 'Please select a valid day.',
  }),
  start_time: z.string(),
  end_time: z.string(),
});

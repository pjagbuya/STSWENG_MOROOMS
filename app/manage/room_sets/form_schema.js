import { z } from 'zod';

export const FORM_SCHEMA = z.object({
  name: z.string().min(2, {
    message: 'Set name must be at least 2 characters.',
  })
  .max(50, {
    message: 'Set name cannot exceed 50 characters.'
  }),
});

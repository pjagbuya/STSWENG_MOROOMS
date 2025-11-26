import { z } from 'zod';

export const FORM_SCHEMA = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Type name must be at least 2 characters.',
    })
    .max(50, {
      message: 'Type name cannot exceed 50 characters.',
    }),
  details: z
    .string()
    .max(999, {
      message: 'Details cannot exceed 999 characters.',
    })
    .optional(),
  capacity: z.number().int().gte(1),
  minReserveTime: z.string(),
  maxReserveTime: z.string(),
});

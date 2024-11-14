import { z } from 'zod';

export const userEditFormSchema = z.object({
  userFirstname: z.string().min(2, {
    message: 'Type name must be at least 2 characters.',
  }),
  userLastname: z.string().min(2, {
    message: 'Type name must be at least 2 characters.',
  }),
});

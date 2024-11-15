import { z } from 'zod';

export const userEditFormSchema = z.object({
  userFirstname: z.string().min(2, {
    message: 'Type name must be at least 2 characters.',
  }),
  userLastname: z.string().min(2, {
    message: 'Type name must be at least 2 characters.',
  }),
});

export const roleEditFormSchema = z.object({
  roleName: z.string().min(2, {
    message: 'Type name must be at least 2 characters.',
  }),
  maxDuration: z.coerce.number().min(1, {
    message: 'Type max duration must be at least 1.',
  }),
  maxNumber: z.coerce.number().min(1, {
    message: 'Type max number must be at least 1.',
  }),
});

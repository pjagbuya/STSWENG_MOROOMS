import { z } from 'zod';

export const userEditFormSchema = z.object({
  userFirstname: z
    .string()
    .min(2, {
      message: 'First name must be at least 2 characters.',
    })
    .max(50, {
      message: 'First name cannot exceed 50 characters.',
    }),
  userLastname: z
    .string()
    .min(2, {
      message: 'Last name must be at least 2 characters.',
    })
    .max(50, {
      message: 'Last name cannot exceed 50 characters.',
    }),
});

export const roleFormSchema = z.object({
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

export const securityQuestionFormSchema = z.object({
  securityAnswer1: z
    .string()
    .min(2, 'Answer must be at least 2 characters')
    .max(100, 'Answer cannot exceed 100 characters'),
  securityAnswer2: z
    .string()
    .min(2, 'Answer must be at least 2 characters')
    .max(100, 'Answer cannot exceed 100 characters'),
});

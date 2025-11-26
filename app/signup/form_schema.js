import {
  securityQuestionFormSchema,
  userEditFormSchema,
} from '../users/[user_id]/home/admin/users/form_schema';
import { passwordSchema } from '@/lib/validation-schemas';
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
];

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Email is invalid' }),
    password: passwordSchema.describe('password'),
    proof: z
      .instanceof(File, { message: 'File is required' })
      .refine(file => {
        return file?.length !== 0;
      }, 'File is required')
      .refine(file => file.size < MAX_FILE_SIZE, 'Max size is 5MB.')
      .refine(
        file => ACCEPTED_IMAGE_TYPES.includes(file.type),
        '.jpg, .jpeg, .png and .webp files are accepted.',
      )
      .describe('Image'),
  })
  .merge(userEditFormSchema);

export const signUpSecurityQuestionsSchema = signupSchema.merge(
  securityQuestionFormSchema,
);

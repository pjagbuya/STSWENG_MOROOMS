import { userEditFormSchema } from '../users/[user_id]/home/admin/users/form_schema';
import { sign } from 'crypto';
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
];

export const singupSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Email is invalid' }),
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(32, { message: 'Password must not exceed 32 characters' })
      .describe('Password'),
    proof: z
      .any()
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

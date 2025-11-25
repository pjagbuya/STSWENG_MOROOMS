import { userEditFormSchema } from '../../home/admin/users/form_schema';
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
];

export const editProfileSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Email is invalid' }),
    password: z
      .string()
      .min(14, { message: 'Password must be at least 14 characters long.' })
      .max(32, { message: 'Password must not exceed 32 characters' })
      .regex(/(?=.*[a-z])/, {
        message: 'Password must contain at least one lowercase letter.',
      })
      .regex(/(?=.*[A-Z])/, {
        message: 'Password must contain at least one uppercase letter.',
      })
      .regex(/(?=.*\d)/, {
        message: 'Password must contain at least one number.',
      })
      .regex(/(?=.*[^A-Za-z0-9])/, {
        message: 'Password must contain at least one special character.',
      })
      .optional()
      .describe('password'),
    userProfilepic: z
      .any()
      .refine(file => {
        return file?.length !== 0;
      }, 'File is required')
      .refine(file => file.size < MAX_FILE_SIZE, 'Max size is 5MB.')
      .refine(
        file => ACCEPTED_IMAGE_TYPES.includes(file.type),
        '.jpg, .jpeg, .png and .webp files are accepted.',
      )
      .optional()
      .describe('Image'),
  })
  .merge(userEditFormSchema);

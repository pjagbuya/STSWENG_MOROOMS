import { z } from 'zod';

export const reservationSchema = z.object({
  reservation_name: z
    .string()
    .min(1, 'Please enter a reservation name.')
    .max(100, 'Reservation name cannot exceed 100 characters.'),
  purpose: z
    .string()
    .min(1, 'Please enter a purpose for the reservation.')
    .max(300, 'Purpose should not exceed 300 characters.'),
  count: z
    .string()
    .min(1, 'Please enter number of participants.')
    .max(9999, 'Number of participants cannot exceed 9999.')
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Please enter a valid number of participants.',
    }),
  selectedDate: z
    .date({ required_error: 'Please select a date.' })
    .nullable()
    .refine(val => val !== null, { message: 'Please select a date.' }),
  selectedHours: z.array(z.number()).min(1, 'Please select at least one hour.'),
  endorsementLetter: z.any().optional(),
});

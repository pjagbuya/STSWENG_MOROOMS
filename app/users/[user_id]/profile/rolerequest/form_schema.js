import { z } from 'zod';

export const roleUpgradeFormSchema = z.object({
  role: z.string().min(1, { message: 'Role is required' }).describe('Dropdown'),
});

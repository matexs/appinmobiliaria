import { z } from 'zod';

export const updateProfileSchema = z.object({
  full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  phone: z.string().optional(),
  avatar_url: z.string().url().optional(),
});

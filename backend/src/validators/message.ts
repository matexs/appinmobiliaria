import { z } from 'zod';

export const createMessageSchema = z.object({
  property_id: z.string().uuid().nullable().optional(),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().default(''),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

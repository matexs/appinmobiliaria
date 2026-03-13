import { z } from 'zod';

export const createVisitSchema = z.object({
  property_id: z.string().uuid('ID de propiedad inválido'),
  visit_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  start_time: z.string().regex(/^\d{2}:00$/, 'La hora debe ser en punto (ej: 09:00, 14:00)'),
});

export const availableSlotsSchema = z.object({
  property_id: z.string().uuid('ID de propiedad inválido'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
});

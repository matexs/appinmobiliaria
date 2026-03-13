import { z } from 'zod';

export const createPropertySchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(200),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z.number().positive('El precio debe ser mayor a 0'),
  address: z.string().min(3, 'La dirección es obligatoria'),
  city: z.string().min(2, 'La ciudad es obligatoria'),
  province: z.string().min(2, 'La provincia es obligatoria'),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  square_meters: z.number().positive('Los metros cuadrados deben ser mayor a 0'),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  property_type_id: z.number().int().positive(),
  status: z.enum(['activa', 'pausada', 'vendida']).default('activa'),
  is_featured: z.boolean().default(false),
});

export const updatePropertySchema = createPropertySchema.partial();

export const propertyFiltersSchema = z.object({
  page: z.string().default('1'),
  limit: z.string().default('12'),
  search: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  property_type_id: z.string().optional(),
  min_price: z.string().optional(),
  max_price: z.string().optional(),
  min_sqm: z.string().optional(),
  max_sqm: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  status: z.string().optional(),
  sort_by: z.string().default('created_at'),
  sort_order: z.string().default('desc'),
});

export const changeStatusSchema = z.object({
  status: z.enum(['activa', 'pausada', 'vendida']),
});

export const toggleFeaturedSchema = z.object({
  is_featured: z.boolean(),
});

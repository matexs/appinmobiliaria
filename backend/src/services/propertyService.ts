import { supabaseAdmin } from '../config/supabase';

interface PropertyFilters {
  page: number;
  limit: number;
  search?: string;
  city?: string;
  province?: string;
  property_type_id?: number;
  min_price?: number;
  max_price?: number;
  min_sqm?: number;
  max_sqm?: number;
  bedrooms?: number;
  bathrooms?: number;
  status?: string;
  sort_by: string;
  sort_order: string;
}

export async function getProperties(filters: PropertyFilters, isAdmin = false) {
  const { page, limit, sort_by, sort_order, ...rest } = filters;
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('properties')
    .select('*, property_types(*), property_images(*)', { count: 'exact' });

  // Visitantes solo ven propiedades activas
  if (!isAdmin) {
    query = query.eq('status', 'activa');
  } else if (rest.status) {
    query = query.eq('status', rest.status);
  }

  if (rest.search) {
    query = query.or(`title.ilike.%${rest.search}%,description.ilike.%${rest.search}%,address.ilike.%${rest.search}%`);
  }

  if (rest.city) query = query.ilike('city', `%${rest.city}%`);
  if (rest.province) query = query.ilike('province', `%${rest.province}%`);
  if (rest.property_type_id) query = query.eq('property_type_id', rest.property_type_id);
  if (rest.min_price) query = query.gte('price', rest.min_price);
  if (rest.max_price) query = query.lte('price', rest.max_price);
  if (rest.min_sqm) query = query.gte('square_meters', rest.min_sqm);
  if (rest.max_sqm) query = query.lte('square_meters', rest.max_sqm);
  if (rest.bedrooms) query = query.gte('bedrooms', rest.bedrooms);
  if (rest.bathrooms) query = query.gte('bathrooms', rest.bathrooms);

  const ascending = sort_order === 'asc';
  query = query.order(sort_by, { ascending }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  return { data: data || [], total: count || 0 };
}

export async function getPropertyById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('properties')
    .select('*, property_types(*), property_images(*, id, image_url, storage_path, is_cover, display_order)')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getFeaturedProperties() {
  const { data, error } = await supabaseAdmin
    .from('properties')
    .select('*, property_types(*), property_images(*)')
    .eq('status', 'activa')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getRecentProperties() {
  const { data, error } = await supabaseAdmin
    .from('properties')
    .select('*, property_types(*), property_images(*)')
    .eq('status', 'activa')
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function createProperty(propertyData: Record<string, unknown>, userId: string) {
  const { data, error } = await supabaseAdmin
    .from('properties')
    .insert({ ...propertyData, created_by: userId })
    .select('*, property_types(*)')
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateProperty(id: string, propertyData: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin
    .from('properties')
    .update(propertyData)
    .eq('id', id)
    .select('*, property_types(*), property_images(*)')
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProperty(id: string) {
  // Primero eliminar imágenes del storage
  const { data: images } = await supabaseAdmin
    .from('property_images')
    .select('storage_path')
    .eq('property_id', id);

  if (images && images.length > 0) {
    const paths = images.map((img) => img.storage_path);
    await supabaseAdmin.storage.from('property-images').remove(paths);
  }

  const { error } = await supabaseAdmin
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function getPropertyTypes() {
  const { data, error } = await supabaseAdmin
    .from('property_types')
    .select('*')
    .order('name');

  if (error) throw new Error(error.message);
  return data || [];
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  province: string;
  latitude: number | null;
  longitude: number | null;
  square_meters: number;
  bedrooms: number;
  bathrooms: number;
  property_type_id: number;
  status: 'activa' | 'pausada' | 'vendida';
  is_featured: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  property_types?: PropertyType;
  property_images?: PropertyImage[];
}

export interface PropertyType {
  id: number;
  name: string;
  slug: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  storage_path: string;
  is_cover: boolean;
  display_order: number;
  created_at: string;
}

export interface Visit {
  id: string;
  property_id: string;
  user_id: string;
  visit_date: string;
  start_time: string;
  end_time: string;
  status: 'confirmada' | 'cancelada' | 'completada';
  notes: string;
  created_at: string;
  updated_at: string;
  properties?: {
    title: string;
    address: string;
    city: string;
    property_images?: PropertyImage[];
  };
  profiles?: {
    full_name: string;
  };
}

export interface ContactMessage {
  id: string;
  property_id: string | null;
  name: string;
  email: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
  properties?: { title: string };
}

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  role: 'user' | 'admin';
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

export interface PropertyFilters {
  search?: string;
  city?: string;
  province?: string;
  property_type_id?: string;
  min_price?: string;
  max_price?: string;
  min_sqm?: string;
  max_sqm?: string;
  bedrooms?: string;
  bathrooms?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  profile?: Profile;
}

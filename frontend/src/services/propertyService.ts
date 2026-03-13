import { supabase } from '../lib/supabase';
import type { ApiResponse, PaginatedResponse, Property, PropertyType, PropertyFilters } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    return { Authorization: `Bearer ${session.access_token}` };
  }
  return {};
}

async function fetchApi<T>(url: string, options: RequestInit = {}): Promise<T> {
  const authHeaders = await getAuthHeaders();
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error en la solicitud');
  }

  return data;
}

// ===== Propiedades =====
export async function getProperties(filters: PropertyFilters = {}): Promise<PaginatedResponse<Property>> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.append(key, String(value));
  });
  return fetchApi<PaginatedResponse<Property>>(`/properties?${params}`);
}

export async function getPropertyById(id: string): Promise<ApiResponse<Property>> {
  return fetchApi<ApiResponse<Property>>(`/properties/${id}`);
}

export async function getFeaturedProperties(): Promise<ApiResponse<Property[]>> {
  return fetchApi<ApiResponse<Property[]>>('/properties/featured');
}

export async function getRecentProperties(): Promise<ApiResponse<Property[]>> {
  return fetchApi<ApiResponse<Property[]>>('/properties/recent');
}

export async function getPropertyTypes(): Promise<ApiResponse<PropertyType[]>> {
  return fetchApi<ApiResponse<PropertyType[]>>('/properties/types');
}

export async function createProperty(data: Partial<Property>): Promise<ApiResponse<Property>> {
  return fetchApi<ApiResponse<Property>>('/properties', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProperty(id: string, data: Partial<Property>): Promise<ApiResponse<Property>> {
  return fetchApi<ApiResponse<Property>>(`/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProperty(id: string): Promise<ApiResponse> {
  return fetchApi<ApiResponse>(`/properties/${id}`, { method: 'DELETE' });
}

export async function changePropertyStatus(id: string, status: string): Promise<ApiResponse<Property>> {
  return fetchApi<ApiResponse<Property>>(`/properties/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function togglePropertyFeatured(id: string, is_featured: boolean): Promise<ApiResponse<Property>> {
  return fetchApi<ApiResponse<Property>>(`/properties/${id}/featured`, {
    method: 'PATCH',
    body: JSON.stringify({ is_featured }),
  });
}

// ===== Imágenes =====
export async function uploadPropertyImages(propertyId: string, files: File[]): Promise<ApiResponse> {
  const { data: { session } } = await supabase.auth.getSession();
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));

  const response = await fetch(`${API_URL}/properties/${propertyId}/images`, {
    method: 'POST',
    headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error subiendo imágenes');
  return data;
}

export async function deletePropertyImage(imageId: string): Promise<ApiResponse> {
  return fetchApi<ApiResponse>(`/properties/images/${imageId}`, { method: 'DELETE' });
}

export async function setPropertyImageCover(imageId: string): Promise<ApiResponse> {
  return fetchApi<ApiResponse>(`/properties/images/${imageId}/cover`, { method: 'PATCH' });
}

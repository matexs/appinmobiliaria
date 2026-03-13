import type { ApiResponse, Profile } from '../types';
import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || '/api';

async function fetchApi<T>(url: string, options: RequestInit = {}): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error en la solicitud');
  return data;
}

export async function getProfile(): Promise<ApiResponse<Profile>> {
  return fetchApi<ApiResponse<Profile>>('/profile');
}

export async function updateProfile(profileData: Partial<Profile>): Promise<ApiResponse<Profile>> {
  return fetchApi<ApiResponse<Profile>>('/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
}

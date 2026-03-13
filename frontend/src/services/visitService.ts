import { supabase } from '../lib/supabase';
import type { ApiResponse, Visit, TimeSlot } from '../types';

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

export async function getAvailableSlots(propertyId: string, date: string): Promise<ApiResponse<TimeSlot[]>> {
  return fetchApi<ApiResponse<TimeSlot[]>>(`/visits/available-slots?property_id=${propertyId}&date=${date}`);
}

export async function createVisit(propertyId: string, visitDate: string, startTime: string): Promise<ApiResponse<Visit>> {
  return fetchApi<ApiResponse<Visit>>('/visits', {
    method: 'POST',
    body: JSON.stringify({ property_id: propertyId, visit_date: visitDate, start_time: startTime }),
  });
}

export async function getVisits(): Promise<ApiResponse<Visit[]>> {
  return fetchApi<ApiResponse<Visit[]>>('/visits');
}

export async function cancelVisit(visitId: string): Promise<ApiResponse<Visit>> {
  return fetchApi<ApiResponse<Visit>>(`/visits/${visitId}/cancel`, { method: 'PATCH' });
}

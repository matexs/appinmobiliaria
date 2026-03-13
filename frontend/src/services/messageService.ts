import type { ApiResponse, ContactMessage } from '../types';
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

export async function sendContactMessage(messageData: {
  property_id?: string | null;
  name: string;
  email: string;
  phone?: string;
  message: string;
}): Promise<ApiResponse> {
  return fetchApi<ApiResponse>('/messages', {
    method: 'POST',
    body: JSON.stringify(messageData),
  });
}

export async function getMessages(): Promise<ApiResponse<ContactMessage[]>> {
  return fetchApi<ApiResponse<ContactMessage[]>>('/messages');
}

export async function markMessageAsRead(messageId: string): Promise<ApiResponse> {
  return fetchApi<ApiResponse>(`/messages/${messageId}/read`, { method: 'PATCH' });
}

export async function getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
  return fetchApi<ApiResponse<{ count: number }>>('/messages/unread-count');
}

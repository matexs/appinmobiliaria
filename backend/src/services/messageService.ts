import { supabaseAdmin } from '../config/supabase';

export async function createMessage(messageData: {
  property_id?: string | null;
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const { data, error } = await supabaseAdmin
    .from('contact_messages')
    .insert(messageData)
    .select('*, properties(title)')
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getMessages(onlyUnread = false) {
  let query = supabaseAdmin
    .from('contact_messages')
    .select('*, properties(title)')
    .order('created_at', { ascending: false });

  if (onlyUnread) {
    query = query.eq('is_read', false);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data || [];
}

export async function markMessageAsRead(messageId: string) {
  const { data, error } = await supabaseAdmin
    .from('contact_messages')
    .update({ is_read: true })
    .eq('id', messageId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getUnreadCount() {
  const { count, error } = await supabaseAdmin
    .from('contact_messages')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);

  if (error) throw new Error(error.message);
  return count || 0;
}

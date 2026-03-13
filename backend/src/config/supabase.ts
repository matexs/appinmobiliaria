import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Cliente con service role para operaciones del backend
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Cliente con anon key para verificar tokens de usuario
export const supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

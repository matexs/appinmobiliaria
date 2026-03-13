import dotenv from 'dotenv';
dotenv.config();

interface EnvConfig {
  PORT: number;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  RESEND_API_KEY: string;
  ADMIN_EMAIL: string;
  FRONTEND_URL: string;
}

function getEnv(): EnvConfig {
  const required = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Variable de entorno requerida: ${key}`);
    }
  }

  return {
    PORT: parseInt(process.env.PORT || '3000', 10),
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    RESEND_API_KEY: process.env.RESEND_API_KEY || '',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  };
}

export const env = getEnv();

import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { supabaseAdmin } from '../config/supabase';

export async function getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', req.user!.id)
      .single();

    if (error) throw new Error(error.message);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(req.body)
      .eq('id', req.user!.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    res.json({ success: true, data, message: 'Perfil actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

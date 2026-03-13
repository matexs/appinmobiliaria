import { supabaseAdmin } from '../config/supabase';

const VALID_HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17]; // 9:00 a 17:00 (última visita 17-18)

interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

export async function getAvailableSlots(propertyId: string, date: string): Promise<TimeSlot[]> {
  // Obtener visitas existentes para ese día y propiedad
  const { data: existingVisits, error } = await supabaseAdmin
    .from('visits')
    .select('start_time')
    .eq('property_id', propertyId)
    .eq('visit_date', date)
    .neq('status', 'cancelada');

  if (error) throw new Error(error.message);

  const takenSlots = new Set(
    (existingVisits || []).map((v) => v.start_time)
  );

  return VALID_HOURS.map((hour) => {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;

    return {
      start_time: startTime,
      end_time: endTime,
      available: !takenSlots.has(startTime + ':00') && !takenSlots.has(startTime),
    };
  });
}

export async function createVisit(
  propertyId: string,
  userId: string,
  visitDate: string,
  startTime: string
): Promise<Record<string, unknown>> {
  const hour = parseInt(startTime.split(':')[0], 10);

  if (!VALID_HOURS.includes(hour)) {
    throw new Error('Horario no válido. Las visitas son de 9:00 a 18:00.');
  }

  // Verificar que la fecha no sea en el pasado
  const visitDateObj = new Date(visitDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (visitDateObj < today) {
    throw new Error('No se pueden agendar visitas en fechas pasadas.');
  }

  const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;

  // Intentar insertar (la constraint UNIQUE manejará duplicados)
  const { data, error } = await supabaseAdmin
    .from('visits')
    .insert({
      property_id: propertyId,
      user_id: userId,
      visit_date: visitDate,
      start_time: startTime,
      end_time: endTime,
      status: 'confirmada',
    })
    .select('*, properties(title, address), profiles(full_name)')
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('Este horario ya está reservado. Por favor elegí otro.');
    }
    throw new Error(error.message);
  }

  return data;
}

export async function getUserVisits(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('visits')
    .select('*, properties(title, address, city, property_images(image_url, is_cover))')
    .eq('user_id', userId)
    .order('visit_date', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getAllVisits() {
  const { data, error } = await supabaseAdmin
    .from('visits')
    .select('*, properties(title, address), profiles(full_name)')
    .order('visit_date', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function cancelVisit(visitId: string, userId: string, isAdmin: boolean) {
  let query = supabaseAdmin
    .from('visits')
    .update({ status: 'cancelada' as const })
    .eq('id', visitId);

  if (!isAdmin) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.select().single();

  if (error) throw new Error(error.message);
  return data;
}

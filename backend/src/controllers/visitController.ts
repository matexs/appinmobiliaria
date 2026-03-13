import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import * as visitService from '../services/visitService';
import { sendVisitConfirmation } from '../services/emailService';

export async function getAvailableSlots(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { property_id, date } = req.query as { property_id: string; date: string };

    if (!property_id || !date) {
      res.status(400).json({ success: false, error: 'property_id y date son requeridos' });
      return;
    }

    const slots = await visitService.getAvailableSlots(property_id, date);
    res.json({ success: true, data: slots });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function create(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { property_id, visit_date, start_time } = req.body;

    const visit = await visitService.createVisit(
      property_id,
      req.user!.id,
      visit_date,
      start_time
    );

    // Enviar email de confirmación
    const visitData = visit as Record<string, unknown>;
    const properties = visitData.properties as { title: string; address: string } | undefined;
    const profiles = visitData.profiles as { full_name: string } | undefined;

    if (properties && profiles) {
      const hour = parseInt(start_time.split(':')[0], 10);
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;

      sendVisitConfirmation(
        req.user!.email,
        profiles.full_name,
        properties.title,
        visit_date,
        start_time,
        endTime,
        properties.address
      ).catch((err) => console.error('Error enviando email:', err));
    }

    res.status(201).json({ success: true, data: visit, message: 'Visita agendada exitosamente' });
  } catch (error) {
    const status = (error as Error).message.includes('reservado') ? 409 : 500;
    res.status(status).json({ success: false, error: (error as Error).message });
  }
}

export async function list(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const isAdmin = req.user!.role === 'admin';
    const data = isAdmin
      ? await visitService.getAllVisits()
      : await visitService.getUserVisits(req.user!.id);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function cancel(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const isAdmin = req.user!.role === 'admin';
    const data = await visitService.cancelVisit(id, req.user!.id, isAdmin);
    res.json({ success: true, data, message: 'Visita cancelada exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

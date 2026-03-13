import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import * as messageService from '../services/messageService';
import { sendContactNotification } from '../services/emailService';

export async function create(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const data = await messageService.createMessage(req.body);

    // Enviar email de notificación al admin
    const propertyTitle = (data as Record<string, unknown>).properties
      ? ((data as Record<string, unknown>).properties as { title: string }).title
      : undefined;

    sendContactNotification(
      req.body.name,
      req.body.email,
      req.body.phone || '',
      req.body.message,
      propertyTitle
    ).catch((err) => console.error('Error enviando notificación:', err));

    res.status(201).json({ success: true, data, message: 'Mensaje enviado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function list(_req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const data = await messageService.getMessages();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function markAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const data = await messageService.markMessageAsRead(id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function getUnreadCount(_req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const count = await messageService.getUnreadCount();
    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

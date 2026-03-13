import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';

export function adminOnly(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Autenticación requerida' });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Acceso denegado. Se requiere rol de administrador.' });
    return;
  }

  next();
}

import { Router } from 'express';
import * as messageController from '../controllers/messageController';
import { authMiddleware } from '../middleware/auth';
import { adminOnly } from '../middleware/adminOnly';
import { validate } from '../middleware/validate';
import { createMessageSchema } from '../validators/message';

const router = Router();

// Cualquiera puede enviar mensajes
router.post('/', validate(createMessageSchema), messageController.create);

// Solo admin puede ver y gestionar mensajes
router.get('/', authMiddleware, adminOnly, messageController.list);
router.get('/unread-count', authMiddleware, adminOnly, messageController.getUnreadCount);
router.patch('/:id/read', authMiddleware, adminOnly, messageController.markAsRead);

export default router;

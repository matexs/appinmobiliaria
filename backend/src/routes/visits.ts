import { Router } from 'express';
import * as visitController from '../controllers/visitController';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createVisitSchema } from '../validators/visit';

const router = Router();

router.get('/available-slots', authMiddleware, visitController.getAvailableSlots);
router.get('/', authMiddleware, visitController.list);
router.post('/', authMiddleware, validate(createVisitSchema), visitController.create);
router.patch('/:id/cancel', authMiddleware, visitController.cancel);

export default router;

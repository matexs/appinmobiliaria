import { Router } from 'express';
import * as propertyController from '../controllers/propertyController';
import { authMiddleware, optionalAuth } from '../middleware/auth';
import { adminOnly } from '../middleware/adminOnly';
import { validate } from '../middleware/validate';
import { createPropertySchema, updatePropertySchema, changeStatusSchema, toggleFeaturedSchema } from '../validators/property';

const router = Router();

// Rutas públicas
router.get('/types', propertyController.getTypes);
router.get('/featured', propertyController.getFeatured);
router.get('/recent', propertyController.getRecent);
router.get('/', optionalAuth, propertyController.list);
router.get('/:id', propertyController.getById);

// Rutas protegidas (admin)
router.post('/', authMiddleware, adminOnly, validate(createPropertySchema), propertyController.create);
router.put('/:id', authMiddleware, adminOnly, validate(updatePropertySchema), propertyController.update);
router.patch('/:id/status', authMiddleware, adminOnly, validate(changeStatusSchema), propertyController.changeStatus);
router.patch('/:id/featured', authMiddleware, adminOnly, validate(toggleFeaturedSchema), propertyController.toggleFeatured);
router.delete('/:id', authMiddleware, adminOnly, propertyController.remove);

export default router;

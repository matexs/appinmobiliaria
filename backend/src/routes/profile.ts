import { Router } from 'express';
import * as profileController from '../controllers/profileController';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateProfileSchema } from '../validators/profile';

const router = Router();

router.get('/', authMiddleware, profileController.getProfile);
router.put('/', authMiddleware, validate(updateProfileSchema), profileController.updateProfile);

export default router;

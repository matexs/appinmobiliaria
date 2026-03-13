import { Router } from 'express';
import multer from 'multer';
import * as imageController from '../controllers/imageController';
import { authMiddleware } from '../middleware/auth';
import { adminOnly } from '../middleware/adminOnly';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const router = Router();

router.post('/:id/images', authMiddleware, adminOnly, upload.array('images', 20), imageController.upload);
router.delete('/images/:id', authMiddleware, adminOnly, imageController.remove);
router.patch('/images/:id/cover', authMiddleware, adminOnly, imageController.setCover);

export default router;

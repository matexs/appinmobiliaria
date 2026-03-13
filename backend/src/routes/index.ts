import { Router } from 'express';
import propertiesRouter from './properties';
import imagesRouter from './images';
import visitsRouter from './visits';
import messagesRouter from './messages';
import profileRouter from './profile';

const router = Router();

router.use('/properties', propertiesRouter);
router.use('/properties', imagesRouter); // /properties/:id/images
router.use('/visits', visitsRouter);
router.use('/messages', messagesRouter);
router.use('/profile', profileRouter);

// Health check
router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API funcionando correctamente', timestamp: new Date().toISOString() });
});

export default router;

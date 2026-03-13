import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middlewares globales
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: { success: false, error: 'Demasiadas solicitudes. Intente más tarde.' },
});

app.use('/api', limiter);

// Rutas API
app.use('/api', routes);

// Error handler global
app.use(errorHandler);

// Iniciar servidor
app.listen(env.PORT, () => {
  console.log(`🏠 Servidor inmobiliaria corriendo en http://localhost:${env.PORT}`);
  console.log(`📡 API disponible en http://localhost:${env.PORT}/api`);
});

export default app;

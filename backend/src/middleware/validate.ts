import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod';

export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[source]);
      req[source] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map((e: ZodIssue) => `${e.path.map(String).join('.')}: ${e.message}`);
        res.status(400).json({
          success: false,
          error: 'Error de validación',
          details: messages,
        });
        return;
      }
      next(error);
    }
  };
}

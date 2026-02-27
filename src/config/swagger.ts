/**
 * Swagger/OpenAPI Configuration
 * Provides API documentation at /api/docs
 */

import { Express, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from './openapi-spec.js';

export function setupSwagger(app: Express): void {
  // Swagger JSON endpoint
  app.get('/api/docs.json', (_req: Request, res: Response) => {
    res.json(openApiSpec);
  });

  // Swagger UI
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { font-size: 2.5em; }
    `,
    customSiteTitle: 'Radio Cesar API Documentation',
  }));
}

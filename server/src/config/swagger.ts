import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management System API',
      version: '1.0.0',
      description: 'A comprehensive RESTful API for managing tasks with JWT authentication',
      contact: {
        name: 'API Support',
        email: 'support@taskmanagement.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://your-production-url.com/api' 
          : `http://localhost:${process.env.PORT || 5000}/api`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in the format: Bearer <token>'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts'], // Path to the API files
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  // Swagger UI setup
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Task Management API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true
    }
  }));

  // JSON endpoint for the swagger spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log(`📚 Swagger documentation available at http://localhost:${process.env.PORT || 5000}/api-docs`);
};
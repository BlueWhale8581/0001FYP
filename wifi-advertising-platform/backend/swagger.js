import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WiFi Connect API Documentation',
      version: '1.0.0',
      description: 'API documentation for WiFi Connect application',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
    },
  },
  // Path to API docs - adjust these paths to where your route documentation will be
  apis: [
    './routes/*.js',                 // If you move routes to separate files
    './controllers/*.js',            // Documentation in controller files
    './index.js',                    // For routes in this file
    './swagger-docs/*.js',           // For dedicated swagger documentation files
  ],
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Setup Swagger middleware
const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  console.log(`📚 API Documentation available at http://localhost:${process.env.PORT || 3001}/api-docs`);
};

export default setupSwagger;
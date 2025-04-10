// backend/swagger.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    './routes/*.js',
    './controllers/*.js',
    './app.js',
    './index.js',
  ],
};

console.log("Swagger is scanning these files:");
['./routes/*.js', './controllers/*.js', './index.js'].forEach(pattern => {
  const directory = path.dirname(pattern);
  const filePattern = path.basename(pattern);
  if (filePattern === '*.js') {
     try {
          const files = fs.readdirSync(directory).filter(file => file.endsWith('.js'));
          files.forEach(file => console.log(`- ${directory}/${file}`));
        } catch (err) {
          console.log(`Could not read directory ${directory}: ${err.message}`);
        }
  } else {
     try {
          if (fs.existsSync(pattern)) {
            console.log(`- ${pattern}`);
          } else {
            console.log(`File not found: ${pattern}`);
          }
        } catch (err) {
          console.log(`Error checking file ${pattern}: ${err.message}`);
        }
  }
});

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Setup Swagger middleware
const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  console.log(`📚 API Documentation available at http://localhost:${process.env.PORT || 3001}/api-docs`);
};

export default setupSwagger;
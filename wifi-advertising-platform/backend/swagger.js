// backend/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const apis = [
     './wifi-advertising-platform/backend/routes/*.js',
     './wifi-advertising-platform/backend/controllers/*.js',
     './wifi-advertising-platform/backend/app.js'
   ];
   
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
  apis,
};

console.log("Swagger is scanning these files:");
apis.forEach(pattern => {
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

module.exports = setupSwagger;
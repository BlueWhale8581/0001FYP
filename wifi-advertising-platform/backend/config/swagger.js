const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wi-Fi Advertising Platform API',
      version: '1.0.0',
      description: 'API documentation for the Wi-Fi Advertising Platform',
    },
    servers: [
      {
        url: 'http://localhost:6419/api',
        description: 'Development Server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
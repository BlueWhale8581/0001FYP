//backend/config/database.js
const sql = require('mssql');
const dotenv = require('dotenv');

dotenv.config();

const config = {  
  server: process.env.DB_SERVER, // Ensure this is a non-empty string
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true, // Use encryption
    enableArithAbort: true,
    trustServerCertificate: true // Add this option if you are using a self-signed certificate
  }
};

async function testConnection() {
  console.log('DB_SERVER:\t', process.env.DB_SERVER);
  console.log('DB_NAME:\t', process.env.DB_NAME);
  console.log('DB_USER:\t', process.env.DB_USER);

  try {
    await sql.connect(config);
    console.log('Database is ready!');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      message: error.message
    });
    console.error('Stack trace:', error.stack);
    return false;
  } finally {
    // Always close the connection to prevent connection pool issues
    await sql.close();
  }
}

module.exports = {
  testConnection
};

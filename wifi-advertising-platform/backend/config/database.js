//backend/config/database.js
const sql = require('mssql');
const dotenv = require('dotenv');

dotenv.config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    enableArithAbort: true,
    trustServerCertificate: true, // Required for self-signed certificates
  },
};

async function testConnection() {
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

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    return pool;
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    throw err;
  });

module.exports = {
  testConnection,
  sql,
  poolPromise,
};

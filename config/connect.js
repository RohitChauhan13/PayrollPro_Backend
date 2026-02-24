const mysql = require('mysql2/promise');
const fs = require('fs');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: 'Z',
    ssl: process.env.CA_PATH
        ? {
              ca: fs.readFileSync(process.env.CA_PATH)
          }
        : undefined
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected successfully");
    console.log('----------------------------------------------');
    console.log();
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); 
  }
})();

module.exports = pool;
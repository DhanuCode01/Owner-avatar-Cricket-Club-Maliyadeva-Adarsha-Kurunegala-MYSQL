import mysql from 'mysql2/promise';
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password:process.env.db_password,
  database: 'db_sports',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export default pool;

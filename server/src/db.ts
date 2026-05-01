import mysql, { Pool, RowDataPacket } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export { RowDataPacket };

const DB_NAME = process.env.DOLT_DATABASE || 'callcenterx';

const baseConfig = {
  host: process.env.DOLT_HOST || '127.0.0.1',
  port: Number(process.env.DOLT_PORT) || 3306,
  user: process.env.DOLT_USER || 'root',
  password: process.env.DOLT_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: false,
};

// Pool is initially created without a database so we can bootstrap it.
// After ensureDatabase() runs, all queries go to the correct database.
export let pool: Pool = mysql.createPool(baseConfig);

export async function ensureDatabase(): Promise<void> {
  const conn = await pool.getConnection();
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  conn.release();

  // Recreate pool pointing at the now-guaranteed database
  await pool.end();
  pool = mysql.createPool({ ...baseConfig, database: DB_NAME });
}

export async function testConnection(): Promise<void> {
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
}

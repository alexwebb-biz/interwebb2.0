import { Pool } from 'pg';

// Prefer pooled / pgbouncer connection string. If you have a pooled URL, set DATABASE_URL to it.
const connectionString = process.env.DATABASE_URL;

let pool: Pool | null = null;

export const getDb = () => {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 1, // keep tiny for serverless / pgbouncer
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false }
    });
  }

  return pool;
};

export const withDb = async <T>(fn: (client: Pool) => Promise<T>): Promise<T> => {
  const db = getDb();
  return fn(db);
};

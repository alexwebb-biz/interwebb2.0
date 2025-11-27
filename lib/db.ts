import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

let pool: Pool | null = null;

export const getDb = () => {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false }
    });
  }

  return pool;
};

export const withDb = async <T>(fn: (client: Pool) => Promise<T>): Promise<T> => {
  const db = getDb();
  return fn(db);
};

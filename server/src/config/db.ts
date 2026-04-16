/**
 * @satisfies read file src/app.ts
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { databaseUrl } from "./env";

let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString: databaseUrl });
  }
  return pool;
}

export function getDb(): ReturnType<typeof drizzle> {
  if (!db) {
    db = drizzle(getPool());
  }
  return db;
}

export async function connect(): Promise<void> {
  const client = await getPool().connect();
  client.release();
}

export async function isConnected(): Promise<boolean> {
  try {
    await connect();
    return true;
  } catch {
    return false;
  }
}

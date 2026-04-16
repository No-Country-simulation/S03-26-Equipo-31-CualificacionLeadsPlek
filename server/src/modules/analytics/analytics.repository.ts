/**
 * @satisfies read file src/app.ts
 */

import { visits, leads } from "../../shared/database/schema";
import { eq, count } from "drizzle-orm";
import type { RegisterVisitDto } from "./analytics.types";
import { getDb } from "../../config/db";

export async function createVisit(data: RegisterVisitDto) {
  const db = getDb();
  const [visit] = await db
    .insert(visits)
    .values({
      source:   data.source   ?? null,
      campaign: data.campaign ?? null,
    })
    .returning();

  return visit;
}

export async function countVisits(): Promise<number> {
  const db = getDb();
  const [row] = await db.select({ total: count() }).from(visits);
  return Number(row?.total ?? 0);
}

export async function countLeads(): Promise<number> {
  const db = getDb();
  const [row] = await db.select({ total: count() }).from(leads);
  return Number(row?.total ?? 0);
}

export async function countConversions(): Promise<number> {
  const db = getDb();
  const [row] = await db
    .select({ total: count() })
    .from(leads)
    .where(eq(leads.status, "converted"));
  return Number(row?.total ?? 0);
}
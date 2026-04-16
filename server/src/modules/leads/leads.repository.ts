/**
 * @satisfies read file src/app.ts
 */

import { eq, and } from "drizzle-orm";
import { getDb } from "../../config/db";
import { leads, events } from "../../shared/database/schema";
import type {
  CreateLeadDto,
  LeadFilters,
  LeadStatus,
} from "./leads.types";

export async function createLead(data: CreateLeadDto) {
  const db = getDb();
  const [lead] = await db
    .insert(leads)
    .values({
      name:        data.name,
      email:       data.email,
      companyType: data.companyType,
      productType: data.productType,
    })
    .returning();

  return lead;
}

export async function findAllLeads(filters: LeadFilters = {}) {
  const db = getDb();

  const conditions = [];
  if (filters.status)      conditions.push(eq(leads.status, filters.status));
  if (filters.companyType) conditions.push(eq(leads.companyType, filters.companyType));

  return db
    .select()
    .from(leads)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(leads.createdAt);
}

export async function findLeadById(id: string) {
  const db = getDb();
  const [lead] = await db
    .select()
    .from(leads)
    .where(eq(leads.id, id));

  return lead ?? null;
}

export async function findLeadByEmail(email: string) {
  const db = getDb();
  const [lead] = await db
    .select()
    .from(leads)
    .where(eq(leads.email, email));

  return lead ?? null;
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const db = getDb();
  const [updated] = await db
    .update(leads)
    .set({ status, updatedAt: new Date() })
    .where(eq(leads.id, id))
    .returning();

  return updated ?? null;
}

export async function deleteLead(id: string) {
  const db = getDb();
  const [deleted] = await db
    .delete(leads)
    .where(eq(leads.id, id))
    .returning();

  return deleted ?? null;
}

export async function createLeadEvent(
  leadId: string,
  type: "LEAD_CREATED" | "LEAD_UPDATED" | "CONVERSION" | "EMAIL_SENT",
  payload?: Record<string, unknown>
) {
  const db = getDb();
  const [event] = await db
    .insert(events)
    .values({
      leadId,
      type,
      payload: payload ? JSON.stringify(payload) : null,
    })
    .returning();

  return event;
}
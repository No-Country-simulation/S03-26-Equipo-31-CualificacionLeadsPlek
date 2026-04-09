import { eq } from "drizzle-orm";
import { emailTemplates } from "../../shared/database/schema";
import type { CreateTemplateDto } from "./email.types";
import { getDb } from "../../config/db";

export async function createTemplate(data: CreateTemplateDto) {
  const db = getDb();
  const [template] = await db
    .insert(emailTemplates)
    .values({
      name:    data.name,
      subject: data.subject,
      body:    data.body,
    })
    .returning();

  return template;
}

export async function findAllTemplates() {
  const db = getDb();
  return db
    .select()
    .from(emailTemplates)
    .orderBy(emailTemplates.createdAt);
}

export async function findTemplateById(id: string) {
  const db = getDb();
  const [template] = await db
    .select()
    .from(emailTemplates)
    .where(eq(emailTemplates.id, id));

  return template ?? null;
}

export async function findTemplateByName(name: string) {
  const db = getDb();
  const [template] = await db
    .select()
    .from(emailTemplates)
    .where(eq(emailTemplates.name, name));

  return template ?? null;
}
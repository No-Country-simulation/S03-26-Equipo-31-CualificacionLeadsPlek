import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const leadStatusEnum = pgEnum("lead_status", [
  "lead",
  "contacted",
  "qualified",
  "converted",
  "lost",
]);

export const companyTypeEnum = pgEnum("company_type", [
  "startup",
  "pyme",
  "enterprise",
  "freelance",
]);

export const productTypeEnum = pgEnum("product_type", [
  "saas",
  "ecommerce",
  "marketplace",
  "other",
]);

export const eventTypeEnum = pgEnum("event_type", [
  "LEAD_CREATED",
  "LEAD_UPDATED",
  "CONVERSION",
  "EMAIL_SENT",
]);

export const leads = pgTable("leads", {
  id:          uuid("id").primaryKey().defaultRandom(),
  name:        varchar("name", { length: 120 }).notNull(),
  email:       varchar("email", { length: 255 }).notNull().unique(),
  companyType: companyTypeEnum("company_type").notNull(),
  productType: productTypeEnum("product_type").notNull(),
  status:      leadStatusEnum("status").notNull().default("lead"),
  createdAt:   timestamp("created_at").defaultNow().notNull(),
  updatedAt:   timestamp("updated_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id:        uuid("id").primaryKey().defaultRandom(),
  leadId:    uuid("lead_id").references(() => leads.id, { onDelete: "cascade" }),
  type:      eventTypeEnum("type").notNull(),
  payload:   text("payload"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const visits = pgTable("visits", {
  id:        uuid("id").primaryKey().defaultRandom(),
  source:    varchar("source", { length: 100 }),   // "facebook", "google", etc.
  campaign:  varchar("campaign", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const emailTemplates = pgTable("email_templates", {
  id:        uuid("id").primaryKey().defaultRandom(),
  name:      varchar("name", { length: 120 }).notNull(),
  subject:   varchar("subject", { length: 255 }).notNull(),
  body:      text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Lead          = typeof leads.$inferSelect;
export type NewLead       = typeof leads.$inferInsert;
export type Event         = typeof events.$inferSelect;
export type NewEvent      = typeof events.$inferInsert;
export type Visit         = typeof visits.$inferSelect;
export type NewVisit      = typeof visits.$inferInsert;
export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type NewEmailTemplate = typeof emailTemplates.$inferInsert;
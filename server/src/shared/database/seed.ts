import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { leads, visits, emailTemplates } from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool);

async function seed() {
  console.log("🌱 Seeding database...");

  // Placeholder Leads 
  const seededLeads = await db
    .insert(leads)
    .values([
      {
        name:        "Alice Martin",
        email:       "alice.martin@example.com",
        companyType: "startup",
        productType: "saas",
        status:      "lead",
      },
      {
        name:        "Bob Torres",
        email:       "bob.torres@example.com",
        companyType: "pyme",
        productType: "ecommerce",
        status:      "contacted",
      },
      {
        name:        "Carol Nguyen",
        email:       "carol.nguyen@example.com",
        companyType: "enterprise",
        productType: "marketplace",
        status:      "qualified",
      },
      {
        name:        "David Kim",
        email:       "david.kim@example.com",
        companyType: "freelance",
        productType: "other",
        status:      "converted",
      },
      {
        name:        "Eva Rossi",
        email:       "eva.rossi@example.com",
        companyType: "startup",
        productType: "saas",
        status:      "lost",
      },
    ])
    .returning();

  console.log(`  ✔ ${seededLeads.length} leads inserted`);

  // Visits 
  const seededVisits = await db
    .insert(visits)
    .values([
      { source: "google",    campaign: "spring_launch_2026" },
      { source: "facebook",  campaign: "retargeting_q1" },
      { source: "linkedin",  campaign: "b2b_outreach" },
      { source: "organic",   campaign: null },
      { source: "referral",  campaign: "partner_program" },
    ])
    .returning();

  console.log(`  ✔ ${seededVisits.length} visits inserted`);

  // Email Templates
  const seededTemplates = await db
    .insert(emailTemplates)
    .values([
      {
        name:    "Welcome Email",
        subject: "Welcome — glad to have you!",
        body:    "<html><body><h1>Welcome!</h1><p>Thanks for signing up. We're excited to have you on board.</p></body></html>",
      },
      {
        name:    "Follow-up",
        subject: "Just checking in",
        body:    "<html><body><p>Hi, we wanted to follow up and see if you have any questions. We're here to help.</p></body></html>",
      },
      {
        name:    "Conversion Confirmation",
        subject: "You're all set!",
        body:    "<html><body><h1>Confirmed!</h1><p>Your account has been activated. Let's get started.</p></body></html>",
      },
    ])
    .returning();

  console.log(`  ✔ ${seededTemplates.length} email templates inserted`);

  console.log("✅ Seed complete.");
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => pool.end());

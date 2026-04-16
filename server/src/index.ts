/**
 * @satisfies read file src/app.ts
 */

import app from "./app";
import { port } from "./config/env";
import { connect } from "./config/db";

import leadsRouter from "./modules/leads/leads.routes";

app.use("/api/leads", leadsRouter);

app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
  try {
    await connect();
    console.log("Database connected successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Database connection failed: ${message}`);
    console.warn("Use POST /api/database/connect to retry");
  }
});

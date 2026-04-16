/**
 * @satisfies read file src/app.ts
 */

import { Router, Request, Response } from "express";
import { isConnected, connect } from "../config/db";

const router = Router();

router.get("/health", async (_req: Request, res: Response) => {
  const connected = await isConnected();
  const status = connected ? 200 : 503;
  res.status(status).json({ connected });
});

router.post("/connect", async (_req: Request, res: Response) => {
  try {
    await connect();
    res.json({ connected: true, message: "Database reconnected successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ connected: false, message });
  }
});

export default router;


/**
 * @satisfies read file src/app.ts
 */

import { Request, Response, NextFunction } from "express";
import { listGroups } from "./mailerlite.client";
import { mailerLiteApiKey } from "../../config/env";

export async function healthCheck(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const checkedAt = new Date().toISOString();

  if (!mailerLiteApiKey) {
    res.status(503).json({
      status:     "unreachable",
      provider:   "MailerLite",
      checkedAt,
      error:      "MAILERLITE_API_KEY is not configured",
    });
    return;
  }

  try {
    const { data: groups } = await listGroups();

    res.status(200).json({
      status:     "ok",
      provider:   "MailerLite",
      checkedAt,
      groups:     groups.map((g) => ({ id: g.id, name: g.name })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(503).json({
      status:   "unreachable",
      provider: "MailerLite",
      checkedAt,
      error:    message,
    });
  }
}

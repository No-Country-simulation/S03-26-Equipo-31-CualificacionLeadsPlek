/**
 * @satisfies read file src/app.ts
 */

import { Request, Response, NextFunction } from "express";
import * as analyticsService from "./analytics.service";
import type { RegisterVisitDto } from "./analytics.types";

export async function registerVisit(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const dto: RegisterVisitDto = req.body;
    const visit = await analyticsService.registerVisit(dto);
    res.status(201).json(visit);
  } catch (error) {
    next(error);
  }
}

export async function getSummary(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const summary = await analyticsService.getSummary();
    res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
}

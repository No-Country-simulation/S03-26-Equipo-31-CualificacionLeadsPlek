/**
 * @satisfies read file src/app.ts
 */

import { Router } from "express";
import { healthCheck } from "./mailerlite.controller";

const router = Router();

router.get("/health", healthCheck);

export default router;

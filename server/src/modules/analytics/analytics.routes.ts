

import { Router } from "express";
import * as analyticsController from "./analytics.controller";

const router = Router();

router.post("/visit", analyticsController.registerVisit);

router.get("/summary", analyticsController.getSummary);

export default router;
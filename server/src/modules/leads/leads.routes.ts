import { Router } from "express";
import * as leadsController from "./leads.controller";

const router = Router();

router.post("/", leadsController.createLead);

router.get("/", leadsController.getAllLeads);

router.get("/:id", leadsController.getLeadById);

router.patch("/:id", leadsController.updateLeadStatus);

router.delete("/:id", leadsController.deleteLead);

export default router;
import { Router } from "express";
import * as emailController from "./email.controller";

const router = Router();

router.post("/templates", emailController.createTemplate);

router.get("/templates", emailController.getAllTemplates);

router.post("/send", emailController.sendEmail);

export default router;
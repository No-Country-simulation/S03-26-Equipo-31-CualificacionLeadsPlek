import { Request, Response, NextFunction } from "express";
import * as emailService from "./email.service";
import { NotFoundError, ConflictError, ValidationError } from "./email.service";
import type { CreateTemplateDto, SendEmailDto } from "./email.types";

export async function createTemplate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const dto: CreateTemplateDto = req.body;
    const { name, subject, body } = dto;

    if (!name || !subject || !body) {
      res.status(400).json({
        error: "Faltan campos requeridos: name, subject, body",
      });
      return;
    }

    const template = await emailService.createTemplate(dto);
    res.status(201).json(template);
  } catch (error) {
    if (error instanceof ConflictError) {
      res.status(409).json({ error: error.message });
      return;
    }
    next(error);
  }
}

export async function getAllTemplates(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const templates = await emailService.getAllTemplates();
    res.status(200).json(templates);
  } catch (error) {
    next(error);
  }
}

export async function sendEmail(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const dto: SendEmailDto = req.body;
    const result = await emailService.sendEmail(dto);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    if (error instanceof ValidationError) {
      res.status(422).json({ error: error.message });
      return;
    }
    next(error);
  }
}
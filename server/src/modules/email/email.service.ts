import * as emailRepository from "./email.repository";
import type { CreateTemplateDto, SendEmailDto } from "./email.types";

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export async function createTemplate(data: CreateTemplateDto) {
  const existing = await emailRepository.findTemplateByName(data.name);
  if (existing) {
    throw new ConflictError(`Ya existe un template con el nombre: "${data.name}"`);
  }

  return emailRepository.createTemplate(data);
}

export async function getAllTemplates() {
  return emailRepository.findAllTemplates();
}

export async function sendEmail(dto: SendEmailDto) {
  if (!dto.templateId) {
    throw new ValidationError("El campo 'templateId' es requerido");
  }
  if (!dto.to || dto.to.length === 0) {
    throw new ValidationError("Debes especificar al menos un destinatario en 'to'");
  }

  const template = await emailRepository.findTemplateById(dto.templateId);
  if (!template) {
    throw new NotFoundError(`Template con id "${dto.templateId}" no encontrado`);
  }

  /// Configure email provider here

  return {
    templateId: template.id,
    subject:    template.subject,
    to:         dto.to,
    sentAt:     new Date(),
    status:     "queued",
  };
}
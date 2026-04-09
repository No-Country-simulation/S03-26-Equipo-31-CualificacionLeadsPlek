export interface CreateTemplateDto {
  name: string;
  subject: string;
  body: string;
}

export interface SendEmailDto {
  templateId: string;
  to: string[];
}

export interface TemplateResponse {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}
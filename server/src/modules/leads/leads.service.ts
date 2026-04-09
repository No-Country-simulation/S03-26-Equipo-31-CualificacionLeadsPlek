import * as leadsRepository from "./leads.repository";
import { VALID_TRANSITIONS } from "./leads.types";
import type {
  CreateLeadDto,
  UpdateLeadStatusDto,
  LeadFilters,
} from "./leads.types";

export async function createLead(data: CreateLeadDto) {
  const existing = await leadsRepository.findLeadByEmail(data.email);
  if (existing) {
    throw new ConflictError(`Ya existe un lead con el email: ${data.email}`);
  }

  const lead = await leadsRepository.createLead(data);

  await leadsRepository.createLeadEvent(lead.id, "LEAD_CREATED", {
    name:        lead.name,
    companyType: lead.companyType,
    productType: lead.productType,
  });

  return lead;
}

export async function getAllLeads(filters: LeadFilters = {}) {
  return leadsRepository.findAllLeads(filters);
}

export async function getLeadById(id: string) {
  const lead = await leadsRepository.findLeadById(id);
  if (!lead) {
    throw new NotFoundError(`Lead con id "${id}" no encontrado`);
  }
  return lead;
}

export async function updateLeadStatus(id: string, dto: UpdateLeadStatusDto) {
  const lead = await leadsRepository.findLeadById(id);
  if (!lead) {
    throw new NotFoundError(`Lead con id "${id}" no encontrado`);
  }

  const allowedTransitions = VALID_TRANSITIONS[lead.status];
  if (!allowedTransitions.includes(dto.status)) {
    throw new ValidationError(
      `Transición inválida: "${lead.status}" → "${dto.status}". ` +
      `Transiciones permitidas: [${allowedTransitions.join(", ") || "ninguna"}]`
    );
  }

  const updated = await leadsRepository.updateLeadStatus(id, dto.status);

  const eventType = dto.status === "converted" ? "CONVERSION" : "LEAD_UPDATED";
  await leadsRepository.createLeadEvent(id, eventType, {
    previousStatus: lead.status,
    newStatus:      dto.status,
  });

  return updated;
}

// ─── Eliminar lead ────────────────────────────────────────────────────────────
export async function deleteLead(id: string) {
  const lead = await leadsRepository.findLeadById(id);
  if (!lead) {
    throw new NotFoundError(`Lead con id "${id}" no encontrado`);
  }
  return leadsRepository.deleteLead(id);
}

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
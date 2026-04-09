import { Request, Response, NextFunction } from "express";
import * as leadsService from "./leads.service";
import { NotFoundError, ConflictError, ValidationError } from "./leads.service";
import type { CreateLeadDto, UpdateLeadStatusDto, LeadFilters } from "./leads.types";

export async function createLead(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const dto: CreateLeadDto = req.body;
    const { name, email, companyType, productType } = dto;

    if (!name || !email || !companyType || !productType) {
      res.status(400).json({
        error: "Faltan campos requeridos: name, email, companyType, productType",
      });
      return;
    }

    const lead = await leadsService.createLead(dto);
    res.status(201).json(lead);
  } catch (error) {
    if (error instanceof ConflictError) {
      res.status(409).json({ error: error.message });
      return;
    }
    next(error);
  }
}

export async function getAllLeads(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const filters: LeadFilters = {
      status:      req.query.status      as LeadFilters["status"],
      companyType: req.query.companyType as LeadFilters["companyType"],
    };

    const leads = await leadsService.getAllLeads(filters);
    res.status(200).json(leads);
  } catch (error) {
    next(error);
  }
}

export async function getLeadById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params as { id: string }; // 👈 cast aquí

    const lead = await leadsService.getLeadById(id);
    res.status(200).json(lead);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
}

export async function updateLeadStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params as { id: string }; // 👈 cast aquí
    const dto: UpdateLeadStatusDto = req.body;

    if (!dto.status) {
      res.status(400).json({ error: "El campo 'status' es requerido" });
      return;
    }

    const updated = await leadsService.updateLeadStatus(id, dto);
    res.status(200).json(updated);
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

export async function deleteLead(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params as { id: string }; // 👈 cast aquí

    const deleted = await leadsService.deleteLead(id);
    res.status(200).json({ message: "Lead eliminado", lead: deleted });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
}

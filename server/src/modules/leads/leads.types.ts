export type LeadStatus = "lead" | "contacted" | "qualified" | "converted" | "lost";
export type CompanyType = "startup" | "pyme" | "enterprise" | "freelance";
export type ProductType = "saas" | "ecommerce" | "marketplace" | "other";

export interface CreateLeadDto {
  name: string;
  email: string;
  companyType: CompanyType;
  productType: ProductType;
}

export interface UpdateLeadStatusDto {
  status: LeadStatus;
}

export interface LeadFilters {
  status?: LeadStatus;
  companyType?: CompanyType;
}

export interface LeadResponse {
  id: string;
  name: string;
  email: string;
  companyType: CompanyType;
  productType: ProductType;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const VALID_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  lead:      ["contacted", "lost"],
  contacted: ["qualified", "lost"],
  qualified: ["converted", "lost"],
  converted: [],
  lost:      [],
};
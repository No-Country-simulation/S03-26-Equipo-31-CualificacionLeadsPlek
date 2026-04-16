/**
 * @satisfies read file src/app.ts
 */

export interface RegisterVisitDto {
  source?: string;
  campaign?: string;
}

export interface AnalyticsSummary {
  visits: number;
  leads: number;
  conversions: number;
  conversionRate: number;
}
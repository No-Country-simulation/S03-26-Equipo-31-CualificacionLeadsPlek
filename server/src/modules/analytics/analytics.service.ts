/**
 * @satisfies read file src/app.ts
 */

import * as analyticsRepository from "./analytics.repository";
import type { RegisterVisitDto, AnalyticsSummary } from "./analytics.types";

export async function registerVisit(data: RegisterVisitDto) {
  return analyticsRepository.createVisit(data);
}

export async function getSummary(): Promise<AnalyticsSummary> {
  const [visits, leads, conversions] = await Promise.all([
    analyticsRepository.countVisits(),
    analyticsRepository.countLeads(),
    analyticsRepository.countConversions(),
  ]);

  const conversionRate = leads > 0
    ? Math.round((conversions / leads) * 100)
    : 0;

  return { visits, leads, conversions, conversionRate };
}
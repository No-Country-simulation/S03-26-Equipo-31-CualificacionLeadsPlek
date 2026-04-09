/**
 * @project No Country: S03-26-Equipo-31-CualificacionLeadsPlek backend
 * @author      [ developer: Andrés Segura, requirements-design: Lucas Matias Segovia ]
 * @version     1.0.0
 *
 * @requires    Node.js >=v24.13.1
 * @fileoverview
 * @see        https://github.com/No-Country-simulation/S03-26-Equipo-31-CualificacionLeadsPlek/tree/develop-backend/LICENCE.md
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
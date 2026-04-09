/**
 * @satisfies No Country: S03-26-Equipo-31-CualificacionLeadsPlek - Backend Project
 * Diseño e implementación de un sistema de generación y cualificación de 
 * leads B2B para PLEK. Incluye estrategia de contenido, landing page 
 * con formularios inteligentes y dashboard para medir tráfico, conversión 
 * y leads, como prototipo de embudo de ventas digital orientado a Growth.
 * 
 * @author      [ Developer: Andrés Segura, Requeriments-Design: Lucas Segovia ]
 * @since       2026-04-06
 * @version     1.0.1
 *
 * @requires    Node.js >= v24.13.1
 *
 * @see       https://github.com/No-Country-simulation/S03-26-Equipo-31-CualificacionLeadsPlek/tree/develop-backend/README.md
 */

import app from "./app";
import { port } from "./config/env";
import { connect } from "./config/db";

import leadsRouter from "./modules/leads/leads.routes";

app.use("/api/leads", leadsRouter);

app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
  try {
    await connect();
    console.log("Database connected successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Database connection failed: ${message}`);
    console.warn("Use POST /api/database/connect to retry");
  }
});

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

import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import databaseRouter from "./routes/database";
import leadsRouter     from "./modules/leads/leads.routes";
import analyticsRouter from "./modules/analytics/analytics.routes";
import emailRouter     from "./modules/email/email.routes";


const ALLOWED_ORIGINS = ["*"];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (ALLOWED_ORIGINS.includes("*") || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/leads",     leadsRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/emails",    emailRouter);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(`[Error] ${err.name}: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/api/database", databaseRouter);

export default app;

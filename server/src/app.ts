import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import databaseRouter from "./routes/database";

const app = express();

// Static files
app.use(express.static(path.join(__dirname, "../public")));

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/api/database", databaseRouter);

export default app;

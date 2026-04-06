import "dotenv/config";

export const port: number = Number(process.env.PORT) || 3000;
export const nodeEnv: string = process.env.NODE_ENV || "development";
export const databaseUrl: string = process.env.DATABASE_URL || "";

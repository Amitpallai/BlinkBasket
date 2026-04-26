import "dotenv/config";

const toPort = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: toPort(process.env.PORT, 4000),
  clientOrigins: (process.env.CLIENT_ORIGINS ??
    "https://grocery-mart-alpha.vercel.app, http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

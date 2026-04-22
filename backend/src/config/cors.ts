import cors, { CorsOptions } from "cors";
import { env } from "./env";

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Allow server-to-server and tools without an Origin header.
    if (!origin) return callback(null, true);
    if (env.clientOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

export const corsMiddleware = cors(corsOptions);

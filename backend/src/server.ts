import app from "./app";
import { env } from "./config/env";
import { connectServices } from "./config/services";

// For local development only
if (process.env.NODE_ENV !== "production") {
  const startServer = async () => {
    try {
      const { setServers } = await import("node:dns/promises"); // dynamic to avoid Vercel issues
      setServers(["1.1.1.1", "8.8.8.8"]);
      await connectServices();
      app.listen(env.port, () => {
        console.log(`🚀 Server running on port ${env.port}`);
      });
    } catch (error) {
      console.error("❌ Failed to start server:", error);
      process.exit(1);
    }
  };

  startServer();
}

// ✅ Connect services lazily for Vercel (called on first request)
export default app;
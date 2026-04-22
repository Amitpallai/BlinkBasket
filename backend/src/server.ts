import app from "./app";
import { env } from "./config/env";
import { connectServices } from "./config/services";
import { setServers } from "node:dns/promises";

const startServer = async () => {
  try {
    // Fix DNS (for MongoDB ECONNREFUSED issue)
    setServers(["1.1.1.1", "8.8.8.8"]);

    // Connect services
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
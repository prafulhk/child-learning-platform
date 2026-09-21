import { app } from "./app.js";
import { config } from "./config/index.js";
import { connectDatabase } from "./config/database.js";

async function startServer(): Promise<void> {
  await connectDatabase();

  app.listen(config.PORT, () => {
    console.log(`API server running on http://localhost:${config.PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

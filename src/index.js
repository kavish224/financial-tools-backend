import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import { app } from "./app.js";
import { logger } from "./utils/logger.js";
import { IS_PRODUCTION } from "./constants.js";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT;
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  process.exit(0);
};
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
connectDB().then(() => {
  const server = app.listen(PORT, "0.0.0.0", () => {
    logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
  if (IS_PRODUCTION) {
    server.timeout = 30000;
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;
  }
}).catch((err) => {
  console.error("❌ Failed to start the server:", err.message);
  logger.error("❌ Failed to start server:", err);
  process.exit(1);
})
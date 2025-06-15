import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger.js";
import { IS_PRODUCTION } from "../constants.js";

const prismaConfig = {
  log: IS_PRODUCTION
    ? ['error', 'warn']
    : ['query', 'info', 'warn', 'error'],

  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },

  // Connection pooling configuration
  ...(IS_PRODUCTION && {
    datasources: {
      db: {
        url: `${process.env.DATABASE_URL}?connection_limit=10&pool_timeout=20`
      }
    }
  })
};

const prisma = new PrismaClient(prismaConfig);

export const connectDB = async () => {
  try {
    await prisma.$connect();

    // Test the connection
    await prisma.$queryRaw`SELECT 1`;

    logger.info("✅ Database connection successful!");

    // Set up connection event handlers
    prisma.$on('error', (e) => {
      logger.error('Prisma error:', e);
    });

    if (!IS_PRODUCTION) {
      prisma.$on('query', (e) => {
        logger.debug('Query executed:', {
          query: e.query,
          params: e.params,
          duration: `${e.duration}ms`
        });
      });
    }

  } catch (error) {
    logger.error("❌ Database connection failed:", error);
    throw error;
  }
};

// Graceful shutdown handler for Prisma
process.on('beforeExit', async () => {
  logger.info('Disconnecting from database...');
  await prisma.$disconnect();
});

export default prisma;
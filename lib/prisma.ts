/**
 * 	Prisma Client Initialization
 * Ensures a single instance of Prisma Client is used across the application.
 * This prevents issues with hot reloading in development environments.
 * @file lib/prisma.ts
 * @author Gaurav Kumar
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  }

  export default prisma; 
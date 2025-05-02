// lib/prisma.js

import { PrismaClient } from "@prisma/client";

// Mencegah multiple instances di development
const globalForPrisma = global;

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient();
  }

const prisma = globalForPrisma.prisma;

export default prisma;

import { PrismaClient } from "@prisma/client";

// Global tipini genişlet
declare global {
  var prisma: PrismaClient | undefined;
}

// Development'da hot reload sırasında
// birden fazla PrismaClient instance'ı oluşmasını engelle
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export { prisma };

import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@example.com" },
    });

    if (existingAdmin) {
      console.log("Admin user already exists. Skipping seeding.");
      return;
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash("admin", 10);

    // Create default admin user
    const adminUser = await prisma.user.create({
      data: {
        firstName: "admin",
        lastName: "admin",
        email: "admin@example.com",
        age: 30,
        password: hashedPassword,
      },
    });

    console.log("Admin user created successfully:", adminUser);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

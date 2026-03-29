import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");
  
  // Clear existing
  await prisma.territory.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.user.deleteMany();
  await prisma.office.deleteMany();
  await prisma.supplier.deleteMany();

  // Create Office
  const office = await prisma.office.create({
    data: {
      name: "Ray White Sydney",
      address: "123 George St, Sydney NSW 2000"
    }
  });

  // Create Users
  const password = await bcrypt.hash("password123", 10);
  
  const admin = await prisma.user.create({
    data: {
      email: "admin@agency.com",
      name: "Admin User",
      password,
      role: "AGENCY_ADMIN",
      officeId: office.id
    }
  });

  const agent = await prisma.user.create({
    data: {
      email: "agent@agency.com",
      name: "John Agent",
      password,
      role: "AGENT",
      officeId: office.id
    }
  });

  // Create Supplier
  const printer = await prisma.supplier.create({
    data: {
      name: "FastPrint Co",
      type: "PRINTER",
      email: "orders@fastprint.com"
    }
  });

  // Create Campaign
  await prisma.campaign.create({
    data: {
      title: "Just Sold - 42 Wallaby Way",
      type: "JUST_SOLD",
      objective: "Generate appraisals in the immediate area",
      status: "APPROVED",
      agentId: agent.id,
      officeId: office.id,
      printSize: "DL",
      printStock: "150gsm Gloss",
      printQuantity: 2000,
      inHomeDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      territories: {
        create: [
          {
            name: "Sydney CBD North",
            geoJson: JSON.stringify({ type: "Polygon", coordinates: [[[151.2, -33.8], [151.21, -33.8], [151.21, -33.81], [151.2, -33.81], [151.2, -33.8]]] }),
            estimatedHouseholds: 2000
          }
        ]
      }
    }
  });

  console.log("Database seeded successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

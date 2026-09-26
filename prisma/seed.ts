import { PrismaClient, UserRole } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hashPassword("admin1234");
  const admin = await prisma.user.upsert({
    where: { loginId: "admin" },
    update: {},
    create: {
      loginId: "admin",
      email: "admin@stocksense.local",
      name: "Admin User",
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  const warehouse = await prisma.warehouse.upsert({
    where: { shortCode: "WH" },
    update: {},
    create: {
      name: "Main Warehouse",
      shortCode: "WH",
      address: "100 Industrial Ave",
    },
  });

  const stockLoc = await prisma.location.upsert({
    where: { warehouseId_shortCode: { warehouseId: warehouse.id, shortCode: "STOCK" } },
    update: {},
    create: {
      name: "Stock Floor",
      shortCode: "STOCK",
      warehouseId: warehouse.id,
    },
  });

  const category = await prisma.category.upsert({
    where: { name: "Raw Materials" },
    update: {},
    create: { name: "Raw Materials" },
  });

  const product = await prisma.product.upsert({
    where: { sku: "STEEL-001" },
    update: {},
    create: {
      name: "Steel Rods",
      sku: "STEEL-001",
      categoryId: category.id,
      unitOfMeasure: "kg",
      unitCost: 12.5,
      reorderMin: 10,
    },
  });

  await prisma.stockQuant.upsert({
    where: { productId_locationId: { productId: product.id, locationId: stockLoc.id } },
    update: {},
    create: {
      productId: product.id,
      locationId: stockLoc.id,
      onHand: 100,
      reserved: 0,
    },
  });

  await prisma.contact.upsert({
    where: { id: "seed-contact-vendor" },
    update: {},
    create: {
      id: "seed-contact-vendor",
      name: "Acme Supplies",
      email: "vendor@acme.example",
    },
  });

  console.log("Seed complete. Login: admin / admin1234", admin.loginId);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

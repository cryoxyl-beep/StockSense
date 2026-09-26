import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("Admin123!", 12);

  await prisma.user.upsert({
    where: { email: "admin@stocksense.local" },
    update: {
      name: "StockSense Admin",
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
    create: {
      email: "admin@stocksense.local",
      name: "StockSense Admin",
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  });

  const warehouse = await prisma.warehouse.upsert({
    where: { code: "MAIN" },
    update: { name: "Main Warehouse" },
    create: { code: "MAIN", name: "Main Warehouse" },
  });

  await prisma.location.upsert({
    where: {
      warehouseId_code: { warehouseId: warehouse.id, code: "STOCK" },
    },
    update: { name: "Stock", type: "INTERNAL" },
    create: {
      warehouseId: warehouse.id,
      code: "STOCK",
      name: "Stock",
      type: "INTERNAL",
    },
  });

  const category = await prisma.category.upsert({
    where: { name: "Raw Materials" },
    update: {},
    create: { name: "Raw Materials" },
  });

  await prisma.product.upsert({
    where: { sku: "STEEL-ROD" },
    update: {
      name: "Steel Rods",
      uom: "kg",
      categoryId: category.id,
    },
    create: {
      name: "Steel Rods",
      sku: "STEEL-ROD",
      uom: "kg",
      categoryId: category.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

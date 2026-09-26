import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);
  const user = await prisma.user.upsert({
    where: { email: "admin@stocksense.local" },
    update: {},
    create: {
      email: "admin@stocksense.local",
      passwordHash,
    },
  });

  const warehouse = await prisma.warehouse.upsert({
    where: { code: "WH-MAIN" },
    update: {},
    create: {
      name: "Main Warehouse",
      code: "WH-MAIN",
      address: "123 Industrial Ave",
    },
  });

  const products = [
    {
      name: "Steel Rods",
      sku: "STL-ROD-01",
      unitPrice: 120,
      reorderLevel: 20,
      qty: 50,
    },
    {
      name: "Office Chair",
      sku: "CHR-OFF-01",
      unitPrice: 2500,
      reorderLevel: 5,
      qty: 30,
    },
    {
      name: "Packaging Box",
      sku: "BOX-PKG-01",
      unitPrice: 45,
      reorderLevel: 100,
      qty: 200,
    },
  ];

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        name: p.name,
        sku: p.sku,
        unitPrice: p.unitPrice,
        reorderLevel: p.reorderLevel,
        category: "General",
        uom: "Unit",
      },
    });

    await prisma.stockBalance.upsert({
      where: {
        productId_warehouseId: {
          productId: product.id,
          warehouseId: warehouse.id,
        },
      },
      update: { quantity: p.qty },
      create: {
        productId: product.id,
        warehouseId: warehouse.id,
        quantity: p.qty,
      },
    });
  }

  console.log("Seed complete. Login:", user.email, "/ admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

export const siteConfig = {
  name: "StockSense",
  description: "Modular inventory management for products, warehouses, and stock operations.",
  nav: [
    { title: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { title: "Products", href: "/products", icon: "products" },
    {
      title: "Operations",
      icon: "operations",
      children: [
        { title: "Receipts", href: "/operations/receipts" },
        { title: "Delivery orders", href: "/operations/deliveries" },
        { title: "Internal transfers", href: "/operations/transfers" },
        { title: "Adjustments", href: "/operations/adjustments" },
        { title: "Move history", href: "/operations/ledger" },
      ],
    },
    { title: "Warehouses", href: "/settings/warehouses", icon: "warehouses" },
    { title: "My profile", href: "/profile", icon: "profile" },
  ],
} as const;

export type SiteNavItem = (typeof siteConfig.nav)[number];

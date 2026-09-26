import Link from "next/link";

const links = [
  { href: "/operations/receipts", label: "Receipts (incoming)" },
  { href: "/operations/deliveries", label: "Delivery orders" },
  { href: "/operations/transfers", label: "Internal transfers" },
  { href: "/operations/adjustments", label: "Inventory adjustments" },
];

export default function OperationsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Operations</h1>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="font-medium underline">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

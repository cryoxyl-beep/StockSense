import { prisma } from "@/lib/prisma";
import { ContactForm } from "@/components/settings/contact-form";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const contacts = await prisma.contact.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Contacts</h1>
      <ContactForm />
      <ul className="rounded-lg border border-zinc-200 bg-white divide-y">
        {contacts.map((c) => (
          <li key={c.id} className="px-4 py-2 text-sm">
            <span className="font-medium">{c.name}</span>
            {c.email && <span className="text-zinc-500"> — {c.email}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

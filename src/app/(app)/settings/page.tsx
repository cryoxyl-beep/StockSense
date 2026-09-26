import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <ul className="space-y-2">
        <li>
          <Link className="text-zinc-900 underline" href="/settings/warehouses">
            Warehouses
          </Link>
        </li>
        <li>
          <Link className="text-zinc-900 underline" href="/settings/locations">
            Locations
          </Link>
        </li>
        <li>
          <Link className="text-zinc-900 underline" href="/settings/contacts">
            Contacts
          </Link>
        </li>
      </ul>
    </div>
  );
}

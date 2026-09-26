import type { Metadata } from "next";
import { LogoutButton } from "@/components/auth/logout-button";
import { requireUser } from "@/lib/auth/rbac";
import { ROLE_LABELS } from "@/types/roles";

export const metadata: Metadata = { title: "My profile" };

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <section className="mx-auto max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">My profile</h1>
      <p className="mt-2 text-sm text-zinc-400">Account details for the signed-in user.</p>
      <dl className="mt-6 divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <ProfileRow label="Name" value={user.name || "—"} />
        <ProfileRow label="Email" value={user.email || "—"} />
        <ProfileRow label="Role" value={ROLE_LABELS[user.role]} />
      </dl>
      <div className="mt-6">
        <LogoutButton />
      </div>
    </section>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-4 px-4 py-3">
      <dt className="text-sm text-zinc-400">{label}</dt>
      <dd className="col-span-2 text-sm text-zinc-100">{value}</dd>
    </div>
  );
}

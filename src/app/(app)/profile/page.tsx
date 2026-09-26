import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;

  if (!user) return null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">My profile</h1>
      <dl className="max-w-md space-y-2 text-sm">
        <div>
          <dt className="text-zinc-500">Login Id</dt>
          <dd className="font-medium">{user.loginId}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Name</dt>
          <dd>{user.name ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Role</dt>
          <dd>{user.role}</dd>
        </div>
      </dl>
    </div>
  );
}

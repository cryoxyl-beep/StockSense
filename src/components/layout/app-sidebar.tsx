import Link from "next/link";
import { signOut } from "@/auth";
import { User } from "lucide-react";

export function AppSidebar({
  userName,
  loginId,
}: {
  userName?: string | null;
  loginId?: string | null;
}) {
  return (
    <aside className="w-56 shrink-0 border-r border-zinc-200 bg-zinc-50 p-4">
      <div className="mb-6 flex items-center gap-2 text-sm text-zinc-700">
        <User className="h-4 w-4" />
        <div>
          <p className="font-medium">{userName ?? "User"}</p>
          <p className="text-xs text-zinc-500">{loginId}</p>
        </div>
      </div>
      <nav className="space-y-1 text-sm">
        <Link href="/profile" className="block rounded px-2 py-1.5 hover:bg-zinc-200">
          My Profile
        </Link>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button type="submit" className="w-full rounded px-2 py-1.5 text-left hover:bg-zinc-200">
            Logout
          </button>
        </form>
      </nav>
    </aside>
  );
}

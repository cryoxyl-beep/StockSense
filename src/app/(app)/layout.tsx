import { auth } from "@/auth";
import { AppNav } from "@/components/layout/app-nav";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-zinc-50">
      <AppNav />
      <div className="mx-auto flex max-w-7xl">
        <AppSidebar
          userName={session.user.name}
          loginId={session.user.loginId}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

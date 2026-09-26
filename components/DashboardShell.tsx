import { Sidebar } from "@/components/Sidebar";

export function DashboardShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-transparent">
      <Sidebar email={email} />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";
import { siteConfig } from "@/config/site";

export function AuthFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/login" className="mb-8 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500 text-sm font-bold text-zinc-950">
            SS
          </span>
          <span className="text-lg font-semibold text-zinc-50">{siteConfig.name}</span>
        </Link>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl shadow-black/20">
          <h1 className="text-xl font-semibold text-zinc-50">{title}</h1>
          <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

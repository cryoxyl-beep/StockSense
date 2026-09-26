import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center">
      <p className="text-sm text-zinc-500">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-50">Page not found</h1>
      <Link href="/dashboard" className="mt-6 text-sm text-sky-400 hover:text-sky-300">
        Back to dashboard
      </Link>
    </div>
  );
}

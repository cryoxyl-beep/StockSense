export function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{description}</p>
      <div className="mt-8 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 px-6 py-10 text-sm text-zinc-400">
        This module is a placeholder. Creating and editing records is not part of this release.
      </div>
    </section>
  );
}

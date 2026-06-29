export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-lg font-bold text-text">{title}</h1>
        <p className="mt-2 text-sm text-text/50">Coming Soon</p>
      </div>
    </div>
  );
}

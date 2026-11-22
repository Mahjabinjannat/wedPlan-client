// Loading skeleton shared by all dashboard pages (used by each loading.tsx).

export default function DashboardPageLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-3 border-b border-[#eadfd9] pb-5">
        <div className="h-9 w-72 max-w-full rounded-lg bg-[#f0e5e8]" />
        <div className="h-4 w-full max-w-md rounded bg-[#f0e5e8]" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-xl border border-[#eadfd9] bg-white p-5"
          >
            <div className="h-4 w-24 rounded bg-[#f0e5e8]" />
            <div className="mt-4 h-8 w-12 rounded bg-[#f0e5e8]" />
          </div>
        ))}
      </div>

      <div className="h-64 rounded-xl border border-[#eadfd9] bg-white" />
    </div>
  );
}

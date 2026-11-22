import { Suspense } from "react";
import ServiceDetailsContent from "@/components/services/ServiceDetailsContent";

interface ServiceDetailsPageProps {
  params: Promise<{ id: string }>;
}

function ServiceDetailsLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 h-5 w-48 animate-pulse rounded bg-[#f1e4e7]" />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Skeleton */}
        <div className="h-96 animate-pulse rounded-2xl bg-[#f1e4e7]" />

        {/* Details Skeleton */}
        <div className="space-y-6 rounded-2xl border border-[#eadfda] bg-white p-7">
          <div className="h-4 w-32 animate-pulse rounded bg-[#f1e4e7]" />

          <div className="h-8 w-3/4 animate-pulse rounded bg-[#f1e4e7]" />

          <div className="h-4 w-1/2 animate-pulse rounded bg-[#f1e4e7]" />

          <div className="h-8 w-28 animate-pulse rounded bg-[#f1e4e7]" />

          <div className="h-24 animate-pulse rounded bg-[#f1e4e7]" />
        </div>
      </div>
    </main>
  );
}

// Reads the route params inside <Suspense> (required by Next.js 16).
async function ServiceDetailsLoader({ params }: ServiceDetailsPageProps) {
  const { id } = await params;

  return <ServiceDetailsContent id={id} />;
}

export default function ServiceDetailsPage({
  params,
}: ServiceDetailsPageProps) {
  return (
    <Suspense fallback={<ServiceDetailsLoading />}>
      <ServiceDetailsLoader params={params} />
    </Suspense>
  );
}

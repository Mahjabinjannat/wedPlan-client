import { Suspense } from "react";
import BrowseServicesContent from "@/components/services/BrowseServicesContent";

export default function BrowseServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen px-6 py-20 text-center text-[#806c72]">
          Loading wedding services...
        </div>
      }
    >
      <BrowseServicesContent />
    </Suspense>
  );
}


import Link from "next/link";
import { SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function ServiceNotFound() {
  return (
    <main className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
      <SearchX className="mb-5 h-16 w-16 text-[#b68a94]" />

      <h1 className="font-serif text-4xl font-bold text-[#2B2023]">
        Service Not Found
      </h1>

      <p className="mt-4 max-w-md text-[#806c72]">
        The wedding service you&apos;re looking for doesn&apos;t
        exist or is no longer available.
      </p>

      <Link
        href="/services"
        className={buttonVariants({ size: "lg", className: "mt-8 h-11 rounded-xl px-6" })}
      >
        Browse Wedding Services
      </Link>
    </main>
  );
}

import Link from "next/link";
import { Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#8c2338] text-white">
          <Heart size={22} fill="currentColor" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#8c2338]">
          404
        </p>

        <h1 className="mt-2 font-serif text-3xl font-bold text-[#2b2023]">
          Page Not Found
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#806c72]">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className={buttonVariants({ size: "lg", className: "h-10 rounded-xl px-5" })}
          >
            Back to Home
          </Link>
          <Link
            href="/services"
            className={buttonVariants({ variant: "outline", size: "lg", className: "h-10 rounded-xl px-5" })}
          >
            Browse Services
          </Link>
        </div>
      </div>
    </main>
  );
}

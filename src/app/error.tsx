"use client";

import Link from "next/link";
import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

// Shown when a page throws an unexpected error (e.g. a failed API request).
export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <TriangleAlert size={40} className="mx-auto text-[#8c2338]" />

        <h1 className="mt-4 font-serif text-3xl font-bold text-[#2b2023]">
          Something Went Wrong
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#806c72]">
          We could not load this page. Please try again in a moment.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            type="button"
            size="lg"
            onClick={reset}
            className="h-10 rounded-xl px-5"
          >
            Try Again
          </Button>
          <Link
            href="/"
            className={buttonVariants({ variant: "outline", size: "lg", className: "h-10 rounded-xl px-5" })}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

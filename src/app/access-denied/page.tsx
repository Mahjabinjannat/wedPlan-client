
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function AccessDeniedPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#fcfaf9] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#eadfda] bg-white p-8 text-center shadow-sm">
        <ShieldAlert
          size={44}
          className="mx-auto text-[#8c2338]"
        />

        <h1 className="mt-5 font-serif text-3xl font-bold text-[#2b2023]">
          Access Denied
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#806c71]">
          You do not have permission to access this page.
        </p>

        <Link
          href="/dashboard"
          className={buttonVariants({ size: "lg", className: "mt-6 h-11 rounded-xl px-6" })}
        >
          Return to Dashboard
        </Link>
      </div>
    </main>
  );
}

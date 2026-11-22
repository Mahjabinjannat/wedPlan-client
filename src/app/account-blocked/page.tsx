
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function AccountBlockedPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#fcfaf9] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#eadfda] bg-white p-8 text-center shadow-sm">
        <ShieldAlert
          size={42}
          className="mx-auto mb-5 text-[#8c2338]"
        />

        <h1 className="font-serif text-3xl font-bold text-[#2b2023]">
          Account Restricted
        </h1>

        <p className="mt-4 text-sm leading-6 text-[#806c71]">
          Your WedPlan account has been blocked.
          Please contact support for assistance.
        </p>

        <Link
          href="/"
          className={buttonVariants({ size: "lg", className: "mt-7 h-11 rounded-xl px-6" })}
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}

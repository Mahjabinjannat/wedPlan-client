import Link from "next/link";
import { Suspense } from "react";
import { CircleCheck } from "lucide-react";

import { requireUser } from "@/lib/require-user";
import { buttonVariants } from "@/components/ui/button";

async function PaymentSuccessContent() {
  await requireUser(["vendor"]);

  // This page only shows a message.
  // Premium is activated by the Stripe webhook on the server,
  // never by this page.
  return (
    <div className="w-full max-w-md rounded-2xl border border-[#eadfda] bg-white p-8 text-center shadow-sm">
      <CircleCheck size={44} className="mx-auto text-emerald-600" />

      <h1 className="mt-4 font-serif text-3xl font-bold text-[#2b2023]">
        Payment Successful
      </h1>

      <p className="mt-3 text-sm leading-6 text-[#806c72]">
        Thank you! Your payment was received. Premium will be active on your
        account within a few seconds, as soon as Stripe confirms it.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/dashboard/subscription"
          className={buttonVariants({ size: "lg", className: "h-10 rounded-xl px-5" })}
        >
          View Subscription
        </Link>
        <Link
          href="/dashboard"
          className={buttonVariants({ variant: "outline", size: "lg", className: "h-10 rounded-xl px-5" })}
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <Suspense
        fallback={<p className="text-[#806c72]">Loading payment details...</p>}
      >
        <PaymentSuccessContent />
      </Suspense>
    </main>
  );
}

import Link from "next/link";
import { ObjectId } from "mongodb";

import { requireUser } from "@/lib/require-user";
import { db } from "@/lib/mongodb";
import { getPremiumSubscription } from "@/lib/sunscription";
import ServiceForm from "@/components/services/ServiceForm";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

const FREE_PLAN_SERVICE_LIMIT = 3;

export default async function AddServicePage() {
  const user = await requireUser(["vendor"]);

  const record = await db.collection("user").findOne({
    _id: new ObjectId(user.id),
  });

  const { isPremium } = getPremiumSubscription(
    record?.subscriptionPlan,
    record?.subscriptionExpiresAt
  );

  // Same rule as the server: active = isActive and not rejected
  const activeCount = await db.collection("services").countDocuments({
    vendorId: user.id,
    isActive: true,
    status: { $ne: "rejected" },
  });

  const limitReached = !isPremium && activeCount >= FREE_PLAN_SERVICE_LIMIT;

  return (
    <section className="rounded-2xl border border-[#eadfda] bg-white p-5 sm:p-7">
      <h1 className="font-serif text-3xl font-bold text-[#2b2023]">
        Add Wedding Service
      </h1>

      <p className="mt-2 text-sm text-[#806c71]">
        Create a new wedding service listing. Submitted services must be
        approved by an admin before they appear publicly.
      </p>

      <Badge
        variant="outline"
        className="mt-4 h-6 border-amber-300 bg-amber-50 px-3 text-amber-900"
      >
        {isPremium
          ? "Premium Plan: unlimited active services"
          : `Free Plan: ${activeCount} of ${FREE_PLAN_SERVICE_LIMIT} active services used`}
      </Badge>

      <div className="mt-6">
        {limitReached ? (
          <div className="rounded-xl border border-dashed border-[#eadfda] p-6 text-center">
            <p className="font-medium text-[#2b2023]">
              You have reached the Free plan limit.
            </p>
            <p className="mt-1 text-sm text-[#806c71]">
              Upgrade to Premium, or hide one of your services, to add a new one.
            </p>
            <Link
              href="/dashboard/subscription"
              className={buttonVariants({ size: "lg", className: "mt-4 h-10 rounded-xl px-5" })}
            >
              Upgrade to Premium
            </Link>
          </div>
        ) : (
          <ServiceForm />
        )}
      </div>
    </section>
  );
}

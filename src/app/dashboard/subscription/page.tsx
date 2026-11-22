import { ObjectId } from "mongodb";
import { CircleCheck, Crown } from "lucide-react";

import { requireUser } from "@/lib/require-user";
import { db } from "@/lib/mongodb";
import { getPremiumSubscription } from "@/lib/sunscription";
import UpgradeButton from "@/components/subscription/UpgradeButton";
import { Badge } from "@/components/ui/badge";

const freeFeatures = [
  "Maximum 3 Active Services",
  "Basic Vendor Dashboard",
  "Booking Request Management",
];

const premiumFeatures = [
  "Unlimited Active Services",
  "Premium Vendor Badge",
  "All Free Plan Features",
];

function formatDate(date: Date | null): string {
  return date
    ? date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";
}

export default async function SubscriptionPage() {
  const user = await requireUser(["vendor"]);

  const record = await db.collection("user").findOne({
    _id: new ObjectId(user.id),
  });

  const { isPremium, expiry } = getPremiumSubscription(
    record?.subscriptionPlan,
    record?.subscriptionExpiresAt
  );

  return (
    <section className="rounded-2xl border border-[#eadfda] bg-white p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <Crown size={28} className="text-amber-600" />
        <h1 className="font-serif text-3xl font-bold text-[#2b2023]">
          Subscription Plans
        </h1>
      </div>

      <p className="mt-3 text-[#806c71]">
        Current plan:{" "}
        <span className="font-semibold text-[#2b2023]">
          {isPremium
            ? `Premium (active until ${formatDate(expiry)})`
            : "Free"}
        </span>
      </p>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        {/* Free plan */}
        <div
          className={`rounded-xl border p-6 ${
            isPremium ? "border-[#eadfda]" : "border-[#8c2338] ring-1 ring-[#8c2338]/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#2b2023]">Free Plan</h2>
            {!isPremium && (
              <Badge variant="secondary" className="h-6 px-3">
                Current
              </Badge>
            )}
          </div>
          <p className="mt-2 font-serif text-3xl font-bold text-[#2b2023]">$0</p>
          <ul className="mt-4 space-y-2 text-sm text-[#806c71]">
            {freeFeatures.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <CircleCheck size={16} className="text-emerald-600" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Premium plan */}
        <div
          className={`rounded-xl border bg-amber-50/30 p-6 ${
            isPremium ? "border-amber-400 ring-1 ring-amber-300" : "border-amber-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#2b2023]">
              Premium Plan
            </h2>
            {isPremium && (
              <Badge className="h-6 bg-amber-100 px-3 text-amber-900">
                Current
              </Badge>
            )}
          </div>
          <p className="mt-2 font-serif text-3xl font-bold text-[#2b2023]">
            $19.99
            <span className="text-sm font-normal text-[#806c71]"> / 30 days</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[#806c71]">
            {premiumFeatures.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <CircleCheck size={16} className="text-amber-600" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <UpgradeButton
              label={isPremium ? "Extend Premium (+30 days)" : "Upgrade to Premium"}
            />
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-[#806c71]">
        Payments are processed securely by Stripe (test mode). Premium is
        activated only after Stripe confirms the payment. When it expires, your
        account returns to the Free plan automatically.
      </p>
    </section>
  );
}

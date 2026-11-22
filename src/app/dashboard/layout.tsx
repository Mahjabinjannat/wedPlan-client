import type { ReactNode } from "react";
import { Suspense } from "react";
import { ObjectId } from "mongodb";

import { requireUser } from "@/lib/require-user";
import { db } from "@/lib/mongodb";
import { getPremiumSubscription } from "@/lib/sunscription";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

async function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const user = await requireUser();

  const record = await db.collection("user").findOne({
    _id: new ObjectId(user.id),
  });

  const { isPremium } = getPremiumSubscription(
    record?.subscriptionPlan,
    record?.subscriptionExpiresAt,
  );

  const businessName =
    typeof record?.businessName === "string" ? record.businessName : undefined;

  return (
    <div className="bg-[#fcfaf9]">
      <div className="mx-auto flex min-h-[480px] max-w-7xl flex-col items-start gap-7 px-5 py-8 md:flex-row md:px-8">
        <DashboardSidebar
          role={user.role}
          businessName={businessName}
          isPremium={isPremium}
        />

        <main className="min-w-0 w-full flex-1">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto min-h-[480px] max-w-7xl animate-pulse px-5 py-8 md:px-8">
          <div className="h-64 rounded-xl bg-[#f6e9ec]" />
        </div>
      }
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}

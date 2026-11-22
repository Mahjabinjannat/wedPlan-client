import Link from "next/link";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { ObjectId } from "mongodb";
import {
  CalendarCheck,
  Clock3,
  CircleCheck,
  CircleX,
  BriefcaseBusiness,
  Crown,
  CirclePlus,
  Search,
  Users,
  ShieldCheck,
  Receipt,
} from "lucide-react";

import { requireUser } from "@/lib/require-user";
import { db } from "@/lib/mongodb";
import { getPremiumSubscription } from "@/lib/sunscription";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Do NOT use:
// export const dynamic = "force-dynamic";
// It is incompatible with cacheComponents in Next.js 16.

type StatTone = "rose" | "amber" | "green" | "red" | "blue";

type StatIcon = typeof CalendarCheck;

interface StatCardProps {
  label: string;
  value: number;
  icon: StatIcon;
  tone: StatTone;
}

function StatCard({ label, value, icon: Icon, tone }: StatCardProps) {
  const colors: Record<StatTone, string> = {
    rose: "bg-[#f6e9ec] text-[#8c2338]",
    amber: "bg-amber-100 text-amber-700",
    green: "bg-emerald-100 text-emerald-700",
    red: "bg-rose-100 text-rose-600",
    blue: "bg-sky-100 text-sky-700",
  };

  return (
    <Card className="min-h-[106px] flex-row items-center justify-between gap-3 border border-[#e9ded8] p-5 shadow-sm ring-0">
      <div>
        <p className="max-w-[135px] text-xs leading-5 text-[#806c71]">
          {label}
        </p>

        <p className="mt-1 font-serif text-3xl font-bold text-[#2b2023]">
          {value}
        </p>
      </div>

      <div className={`rounded-xl p-3 ${colors[tone]}`}>
        <Icon size={20} />
      </div>
    </Card>
  );
}

function PageHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 border-b border-[#eadfd9] pb-4">
      <h1 className="font-serif text-3xl font-bold tracking-tight text-[#2b2023] md:text-4xl">
        {title}
      </h1>

      <p className="mt-1 text-sm text-[#806c71]">{description}</p>
    </div>
  );
}

function ActionLink({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={buttonVariants({
        variant: primary ? "default" : "outline",
        size: "lg",
        className: "h-10 rounded-xl px-4",
      })}
    >
      {children}
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "border-amber-300 bg-amber-50 text-amber-800",
    accepted: "border-emerald-300 bg-emerald-50 text-emerald-800",
    rejected: "border-rose-300 bg-rose-50 text-rose-700",
    cancelled: "border-gray-300 bg-gray-50 text-gray-600",
  };

  const normalizedStatus = status.toLowerCase();

  return (
    <Badge
      variant="outline"
      className={`h-6 shrink-0 px-2.5 ${
        styles[normalizedStatus] ?? "border-gray-300 bg-gray-50 text-gray-600"
      }`}
    >
      {normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}
    </Badge>
  );
}

function formatEventDate(value: unknown): string {
  if (!value) {
    return "Not specified";
  }

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return "Not specified";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

// ============================================
// CUSTOMER OVERVIEW
// ============================================

async function CustomerOverview({ userId }: { userId: string }) {
  const bookings = db.collection("bookings");
  const services = db.collection("services");

  const customerFilter = {
    customerId: {
      $in: [userId, new ObjectId(userId)],
    },
  };

  const [total, pending, accepted, rejected, recent] = await Promise.all([
    bookings.countDocuments(customerFilter),

    bookings.countDocuments({
      ...customerFilter,
      status: "pending",
    }),

    bookings.countDocuments({
      ...customerFilter,
      status: "accepted",
    }),

    bookings.countDocuments({
      ...customerFilter,
      status: "rejected",
    }),

    bookings
      .find(customerFilter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(4)
      .toArray(),
  ]);

  const serviceIds = recent
    .map((booking) => String(booking.serviceId ?? ""))
    .filter((id) => ObjectId.isValid(id))
    .map((id) => new ObjectId(id));

  const serviceDocs =
    serviceIds.length > 0
      ? await services
          .find({
            _id: { $in: serviceIds },
          })
          .toArray()
      : [];

  const serviceNames = new Map(
    serviceDocs.map((service) => [
      String(service._id),
      String(service.serviceName ?? "Wedding Service"),
    ]),
  );

  return (
    <>
      <PageHeading
        title="Customer Overview"
        description="Track your wedding service inquiries and confirmed vendors at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Booking Requests"
          value={total}
          icon={CalendarCheck}
          tone="rose"
        />

        <StatCard
          label="Pending Bookings"
          value={pending}
          icon={Clock3}
          tone="amber"
        />

        <StatCard
          label="Accepted Bookings"
          value={accepted}
          icon={CircleCheck}
          tone="green"
        />

        <StatCard
          label="Rejected Bookings"
          value={rejected}
          icon={CircleX}
          tone="red"
        />
      </div>

      <section className="mt-6 rounded-xl border border-[#e9ded8] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-xl font-bold text-[#2b2023]">
            Recent Booking Requests
          </h2>

          <div className="flex flex-wrap gap-2">
            <ActionLink href="/dashboard/bookings">Manage All</ActionLink>

            <ActionLink href="/services" primary>
              <Search size={15} />
              Browse Services
            </ActionLink>
          </div>
        </div>

        <div className="space-y-3">
          {recent.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#eadfd9] px-5 py-12 text-center">
              <CalendarCheck size={30} className="mx-auto text-[#8c2338]" />

              <p className="mt-3 font-medium text-[#2b2023]">
                No booking requests yet
              </p>

              <p className="mt-1 text-sm text-[#806c71]">
                Browse wedding services to make your first booking request.
              </p>
            </div>
          ) : (
            recent.map((booking) => {
              const serviceId = String(booking.serviceId ?? "");

              const name =
                serviceNames.get(serviceId) ??
                String(booking.serviceName ?? "Wedding Service");

              const status = String(booking.status ?? "pending").toLowerCase();

              return (
                <div
                  key={String(booking._id)}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#eadfd9] bg-[#fcfaf9] px-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-[#30252a]">{name}</p>

                    <p className="mt-1 text-xs text-[#806c71]">
                      Event Date: {formatEventDate(booking.eventDate)}
                      {" • "}
                      {String(
                        booking.eventLocation ?? "Location not specified",
                      )}
                    </p>
                  </div>

                  <StatusBadge status={status} />
                </div>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}

// ============================================
// VENDOR OVERVIEW
// ============================================

async function VendorOverview({ userId }: { userId: string }) {
  const services = db.collection("services");
  const bookings = db.collection("bookings");

  const vendorFilter = {
    vendorId: {
      $in: [userId, new ObjectId(userId)],
    },
  };

  const user = await db.collection("user").findOne({
    _id: new ObjectId(userId),
  });

  const { isPremium, expiry } = getPremiumSubscription(
    user?.subscriptionPlan,
    user?.subscriptionExpiresAt,
  );

  const [totalServices, activeServices, pending, accepted] = await Promise.all([
    services.countDocuments(vendorFilter),

    services.countDocuments({
      ...vendorFilter,
      status: "approved",
      isActive: true,
    }),

    bookings.countDocuments({
      ...vendorFilter,
      status: "pending",
    }),

    bookings.countDocuments({
      ...vendorFilter,
      status: "accepted",
    }),
  ]);

  return (
    <>
      <PageHeading
        title="Vendor Dashboard Overview"
        description="Monitor your published wedding services, incoming couple requests, and subscription status."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Services"
          value={totalServices}
          icon={BriefcaseBusiness}
          tone="rose"
        />

        <StatCard
          label="Approved & Active"
          value={activeServices}
          icon={CircleCheck}
          tone="green"
        />

        <StatCard
          label="Pending Requests"
          value={pending}
          icon={Clock3}
          tone="amber"
        />

        <StatCard
          label="Accepted Bookings"
          value={accepted}
          icon={CalendarCheck}
          tone="blue"
        />
      </div>

      <section
        className={`mt-6 rounded-xl border bg-white p-6 shadow-sm ${
          isPremium ? "border-amber-300" : "border-[#e9ded8]"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <Crown size={23} className="text-amber-600" />

              <h2 className="font-serif text-xl font-bold text-[#2b2023] sm:text-2xl">
                Current Subscription Plan
              </h2>

              <Badge
                variant="outline"
                className="h-6 border-amber-300 bg-amber-50 px-3 text-amber-900"
              >
                {isPremium ? "✧ Premium Plan" : "Free Plan"}
              </Badge>
            </div>

            <p className="mt-2 text-sm leading-6 text-[#806c71]">
              {isPremium
                ? `Unlimited active services, Premium badge & featured placement • Renews/Expires ${formatEventDate(expiry)}`
                : "Up to 3 active services • Basic Vendor Dashboard • Booking Request Management"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <ActionLink href="/dashboard/add-service">
              <CirclePlus size={16} />
              Add Service
            </ActionLink>

            <ActionLink href="/dashboard/subscription" primary>
              Manage Plan
            </ActionLink>
          </div>
        </div>
      </section>
    </>
  );
}

// ============================================
// ADMIN OVERVIEW
// ============================================

async function AdminOverview() {
  const users = db.collection("user");
  const services = db.collection("services");
  const transactions = db.collection("transactions");

  const [
    totalUsers,
    vendors,
    customers,
    totalServices,
    pendingServices,
    totalTransactions,
  ] = await Promise.all([
    users.countDocuments(),

    users.countDocuments({
      role: "vendor",
    }),

    users.countDocuments({
      role: "customer",
    }),

    services.countDocuments(),

    services.countDocuments({
      status: "pending",
    }),

    transactions.countDocuments(),
  ]);

  return (
    <>
      <PageHeading
        title="Admin Dashboard Overview"
        description="Manage platform users, wedding services, and transactions."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total Users"
          value={totalUsers}
          icon={Users}
          tone="rose"
        />

        <StatCard
          label="Vendors"
          value={vendors}
          icon={BriefcaseBusiness}
          tone="blue"
        />

        <StatCard
          label="Customers"
          value={customers}
          icon={Users}
          tone="green"
        />

        <StatCard
          label="Total Services"
          value={totalServices}
          icon={BriefcaseBusiness}
          tone="rose"
        />

        <StatCard
          label="Pending Services"
          value={pendingServices}
          icon={ShieldCheck}
          tone="amber"
        />

        <StatCard
          label="Transactions"
          value={totalTransactions}
          icon={Receipt}
          tone="green"
        />
      </div>

      <section className="mt-6 flex flex-wrap gap-3 rounded-xl border border-[#e9ded8] bg-white p-6">
        <ActionLink href="/dashboard/admin/users">Manage Users</ActionLink>

        <ActionLink href="/dashboard/admin/services">
          Review Services
        </ActionLink>

        <ActionLink href="/dashboard/admin/transactions" primary>
          View Transactions
        </ActionLink>
      </section>
    </>
  );
}

// ============================================
// MAIN DASHBOARD
// ============================================

async function DashboardContent() {
  const user = await requireUser();

  if (user.role === "vendor") {
    return <VendorOverview userId={user.id} />;
  }

  if (user.role === "admin") {
    return <AdminOverview />;
  }

  return <CustomerOverview userId={user.id} />;
}

function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-3 border-b border-[#eadfd9] pb-5">
        <div className="h-9 w-72 max-w-full rounded-lg bg-[#f0e5e8]" />
        <div className="h-4 w-full max-w-md rounded bg-[#f0e5e8]" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-xl border border-[#eadfd9] bg-white p-5"
          >
            <div className="h-4 w-24 rounded bg-[#f0e5e8]" />
            <div className="mt-4 h-8 w-12 rounded bg-[#f0e5e8]" />
          </div>
        ))}
      </div>

      <div className="h-64 rounded-xl border border-[#eadfd9] bg-white" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}

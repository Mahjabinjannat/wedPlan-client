
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  CalendarCheck,
  Settings,
  BriefcaseBusiness,
  CirclePlus,
  Crown,
  Users,
  ShieldCheck,
  Receipt,
} from "lucide-react";

type Role = "customer" | "vendor" | "admin";

interface Props {
  role: Role;
  businessName?: string;
  isPremium?: boolean;
}

const menus = {
  customer: [
    { label: "Overview", href: "/dashboard", icon: LayoutGrid },
    { label: "My Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
    { label: "Profile Settings", href: "/dashboard/profile", icon: Settings },
  ],
  vendor: [
    { label: "Overview", href: "/dashboard", icon: LayoutGrid },
    { label: "My Services", href: "/dashboard/services", icon: BriefcaseBusiness },
    { label: "Add Service", href: "/dashboard/add-service", icon: CirclePlus },
    { label: "Booking Requests", href: "/dashboard/bookings", icon: CalendarCheck },
    { label: "Subscription", href: "/dashboard/subscription", icon: Crown },
    { label: "Profile Settings", href: "/dashboard/profile", icon: Settings },
  ],
  admin: [
    { label: "Overview", href: "/dashboard", icon: LayoutGrid },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Manage Services", href: "/dashboard/admin/services", icon: ShieldCheck },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: Receipt },
  ],
};

export default function DashboardSidebar({
  role,
  businessName,
  isPremium = false,
}: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 self-start rounded-2xl border border-[#e9ded8] bg-white p-4 shadow-sm md:w-[250px]">
      <div className="border-b border-[#eadfd9] pb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#806c71]">
          Workspace
        </p>

        <div className="mt-2 flex items-center justify-between gap-2">
          <h2 className="font-serif text-xl font-bold text-[#2b2023]">
            {role === "customer"
              ? "Customer Portal"
              : role === "vendor"
                ? "Vendor Portal"
                : "Admin Portal"}
          </h2>

          {role === "vendor" && isPremium && (
            <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-900">
              Premium
            </span>
          )}
        </div>

        {role === "vendor" && businessName && (
          <p className="mt-2 truncate text-sm text-[#806c71]">
            {businessName}
          </p>
        )}
      </div>

      <nav
        aria-label={`${role} dashboard navigation`}
        className="mt-4 flex gap-1 overflow-x-auto md:flex-col"
      >
        {menus[role].map(({ label, href, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" &&
              pathname.startsWith(href + "/"));

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
                active
                  ? "bg-[#8c2338] font-medium text-white"
                  : "text-[#756169] hover:bg-[#f8edef]"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

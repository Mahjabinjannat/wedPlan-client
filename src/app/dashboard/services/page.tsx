import Link from "next/link";
import { CirclePlus } from "lucide-react";

import { requireUser } from "@/lib/require-user";
import { db } from "@/lib/mongodb";
import MyServicesTable, {
  type VendorServiceItem,
} from "@/components/services/MyServicesTable";
import { buttonVariants } from "@/components/ui/button";

export default async function MyServicesPage() {
  const user = await requireUser(["vendor"]);

  const records = await db
    .collection("services")
    .find({ vendorId: user.id })
    .sort({ createdAt: -1, _id: -1 })
    .toArray();

  const services: VendorServiceItem[] = records.map((record) => {
    const rawStatus = String(record.status ?? "pending");

    return {
      id: String(record._id),
      serviceName: String(record.serviceName ?? "Wedding Service"),
      category: String(record.category ?? ""),
      price: Number(record.price ?? 0),
      location: String(record.location ?? ""),
      image: Array.isArray(record.images) ? String(record.images[0] ?? "") : "",
      status:
        rawStatus === "approved" || rawStatus === "rejected"
          ? rawStatus
          : "pending",
      isActive: record.isActive === true,
    };
  });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-[#eadfda] pb-5">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2b2023]">
            My Services
          </h1>
          <p className="mt-2 text-sm text-[#806c72]">
            View and manage your services, their approval status and
            availability.
          </p>
        </div>

        <Link
          href="/dashboard/add-service"
          className={buttonVariants({ size: "lg", className: "h-10 rounded-xl px-5" })}
        >
          <CirclePlus size={16} />
          Add New Service
        </Link>
      </div>

      <MyServicesTable services={services} />
    </div>
  );
}

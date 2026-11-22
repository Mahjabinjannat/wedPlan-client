import { requireUser } from "@/lib/require-user";
import { db } from "@/lib/mongodb";
import AdminServicesTable, {
  type AdminServiceItem,
} from "@/components/admin/AdminServicesTable";

export default async function ManageServicesPage() {
  await requireUser(["admin"]);

  const records = await db
    .collection("services")
    .find({})
    .sort({ createdAt: -1, _id: -1 })
    .toArray();

  const services: AdminServiceItem[] = records.map((record) => {
    const rawStatus = String(record.status ?? "pending");

    return {
      id: String(record._id),
      serviceName: String(record.serviceName ?? "Wedding Service"),
      category: String(record.category ?? ""),
      price: Number(record.price ?? 0),
      location: String(record.location ?? ""),
      description: String(record.description ?? ""),
      image: Array.isArray(record.images) ? String(record.images[0] ?? "") : "",
      vendorName: String(record.vendorName ?? "Vendor"),
      vendorEmail: String(record.vendorEmail ?? ""),
      status:
        rawStatus === "approved" || rawStatus === "rejected"
          ? rawStatus
          : "pending",
      isActive: record.isActive === true,
    };
  });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 border-b border-[#eadfda] pb-5">
        <h1 className="font-serif text-3xl font-bold text-[#2b2023]">
          Manage Services
        </h1>
        <p className="mt-2 text-sm text-[#806c72]">
          Review services submitted by vendors. Only approved and available
          services are shown to customers.
        </p>
      </div>

      <AdminServicesTable services={services} />
    </div>
  );
}

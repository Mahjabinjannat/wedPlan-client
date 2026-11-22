import Link from "next/link";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";

import { requireUser } from "@/lib/require-user";
import { db } from "@/lib/mongodb";

import BookingsTable, {
  type BookingItem,
} from "@/components/bookings/BookingsTable";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function BookingsPage() {
  // Only customers and vendors can access this page.
  const user = await requireUser(["customer", "vendor"]);

  // Explicitly narrow the role for TypeScript.
  // This also provides an additional authorization safeguard.
  if (user.role !== "customer" && user.role !== "vendor") {
    redirect("/access-denied");
  }

  const role = user.role;

  // Customers see their bookings.
  // Vendors see requests for their services.
  const filter =
    role === "customer" ? { customerId: user.id } : { vendorId: user.id };

  const records = await db
    .collection("bookings")
    .find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .toArray();

  // Load the first image of each booked service
  const serviceIds = records
    .map((record) => String(record.serviceId ?? ""))
    .filter((id) => ObjectId.isValid(id))
    .map((id) => new ObjectId(id));

  const serviceDocs =
    serviceIds.length > 0
      ? await db
          .collection("services")
          .find({ _id: { $in: serviceIds } })
          .project({ images: 1 })
          .toArray()
      : [];

  const serviceImages = new Map(
    serviceDocs.map((service) => [
      String(service._id),
      Array.isArray(service.images) ? String(service.images[0] ?? "") : "",
    ])
  );

  const bookings: BookingItem[] = records.map((record) => {
    const rawStatus = String(record.status ?? "pending");

    const status: BookingItem["status"] =
      rawStatus === "accepted" ||
      rawStatus === "rejected" ||
      rawStatus === "cancelled"
        ? rawStatus
        : "pending";

    return {
      id: String(record._id),
      serviceName: String(record.serviceName ?? "Wedding Service"),
      serviceImage: serviceImages.get(String(record.serviceId ?? "")) ?? "",
      customerName: String(record.customerName ?? "Customer"),
      customerEmail: String(record.customerEmail ?? ""),
      vendorName: String(record.vendorName ?? "Vendor"),
      eventDate: String(record.eventDate ?? ""),
      eventLocation: String(record.eventLocation ?? ""),
      message: String(record.message ?? ""),
      status,
      createdAt:
        record.createdAt instanceof Date
          ? record.createdAt.toISOString()
          : String(record.createdAt ?? ""),
    };
  });

  const pending = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;

  const accepted = bookings.filter(
    (booking) => booking.status === "accepted",
  ).length;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Page Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-[#eadfda] pb-5">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2b2023]">
            {role === "customer" ? "My Bookings" : "Booking Requests"}
          </h1>

          <p className="mt-2 text-sm text-[#806c72]">
            {role === "customer"
              ? "Track and manage your wedding booking requests."
              : "Review and respond to customer booking requests."}
          </p>
        </div>

        {role === "customer" && (
          <Link
            href="/services"
            className={buttonVariants({
              size: "lg",
              className: "h-10 rounded-xl px-5",
            })}
          >
            Browse Services
          </Link>
        )}
      </div>

      {/* Booking Statistics */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Requests",
            value: bookings.length,
          },
          {
            label: "Pending",
            value: pending,
          },
          {
            label: "Accepted",
            value: accepted,
          },
        ].map((item) => (
          <Card
            key={item.label}
            className="gap-0 border border-[#eadfda] p-5 shadow-sm ring-0"
          >
            <p className="text-sm text-[#806c72]">{item.label}</p>

            <p className="mt-2 font-serif text-3xl font-bold text-[#2b2023]">
              {item.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Customer / Vendor Booking Management */}
      <BookingsTable bookings={bookings} role={role} />
    </div>
  );
}

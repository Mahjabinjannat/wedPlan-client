
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type BookingStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled";

export interface BookingItem {
  id: string;
  serviceName: string;
  serviceImage: string;
  customerName: string;
  customerEmail: string;
  vendorName: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: BookingStatus;
  createdAt: string;
}

interface Props {
  bookings: BookingItem[];
  role: "customer" | "vendor";
}

const badgeStyles: Record<BookingStatus, string> = {
  pending: "border-amber-300 bg-amber-50 text-amber-800",
  accepted: "border-emerald-300 bg-emerald-50 text-emerald-800",
  rejected: "border-rose-300 bg-rose-50 text-rose-700",
  cancelled: "border-gray-300 bg-gray-50 text-gray-600",
};

function formatDate(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      });
}

export default function BookingsTable({
  bookings,
  role,
}: Props) {
  const router = useRouter();

  const [busyId, setBusyId] = useState<string | null>(null);

  async function updateBooking(
    id: string,
    action: "cancel" | "accept" | "reject"
  ) {
    setBusyId(id);

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Action failed.");
      }

      toast.success(data.message);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setBusyId(null);
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#eadfda] bg-white px-5 py-14 text-center">
        <CalendarDays
          size={32}
          className="mx-auto text-[#8c2338]"
        />
        <h2 className="mt-3 font-serif text-xl font-bold text-[#2b2023]">
          No Booking Requests Yet
        </h2>
        <p className="mt-2 text-sm text-[#806c72]">
          {role === "customer"
            ? "Your booking requests will appear here."
            : "Requests from customers will appear here."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <article
          key={booking.id}
          className="rounded-xl border border-[#eadfda] bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#f6e9eb]">
                {booking.serviceImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={booking.serviceImage}
                    alt={booking.serviceName}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="min-w-0">
                <h2 className="font-serif text-xl font-bold text-[#2b2023]">
                  {booking.serviceName}
                </h2>

                <p className="mt-1 text-sm text-[#806c72]">
                  {role === "customer"
                    ? `Vendor: ${booking.vendorName}`
                    : `Customer: ${booking.customerName}${
                        booking.customerEmail ? ` (${booking.customerEmail})` : ""
                      }`}
                </p>
              </div>
            </div>

            <Badge
              variant="outline"
              className={`h-6 px-3 capitalize ${badgeStyles[booking.status]}`}
            >
              {booking.status}
            </Badge>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#806c72]">
            <span className="flex items-center gap-2">
              <CalendarDays size={16} />
              {formatDate(booking.eventDate)}
            </span>

            <span className="flex items-center gap-2">
              <MapPin size={16} />
              {booking.eventLocation}
            </span>

            <span>Requested on {formatDate(booking.createdAt)}</span>
          </div>

          {booking.message && (
            <p className="mt-4 rounded-lg bg-[#fcfaf9] p-3 text-sm leading-6 text-[#806c72]">
              {booking.message}
            </p>
          )}

          {booking.status === "pending" && (
            <div className="mt-5 flex flex-wrap gap-2 border-t border-[#eadfda] pt-4">
              {role === "customer" ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="lg"
                  disabled={busyId !== null}
                  onClick={() =>
                    updateBooking(booking.id, "cancel")
                  }
                >
                  {busyId === booking.id
                    ? "Processing..."
                    : "Cancel Request"}
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    size="lg"
                    disabled={busyId !== null}
                    onClick={() =>
                      updateBooking(booking.id, "accept")
                    }
                  >
                    Accept
                  </Button>

                  <Button
                    type="button"
                    variant="destructive"
                    size="lg"
                    disabled={busyId !== null}
                    onClick={() =>
                      updateBooking(booking.id, "reject")
                    }
                  >
                    Reject
                  </Button>
                </>
              )}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

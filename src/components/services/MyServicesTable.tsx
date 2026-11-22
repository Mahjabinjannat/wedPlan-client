"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BriefcaseBusiness, MapPin, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { secureFetch } from "@/lib/api/secure-fetch";
import { confirmToast } from "@/lib/confirm-toast";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ServiceStatus = "pending" | "approved" | "rejected";

export interface VendorServiceItem {
  id: string;
  serviceName: string;
  category: string;
  price: number;
  location: string;
  image: string;
  status: ServiceStatus;
  isActive: boolean;
}

interface Props {
  services: VendorServiceItem[];
}

const badgeStyles: Record<ServiceStatus, string> = {
  pending: "border-amber-300 bg-amber-50 text-amber-800",
  approved: "border-emerald-300 bg-emerald-50 text-emerald-800",
  rejected: "border-rose-300 bg-rose-50 text-rose-700",
};

export default function MyServicesTable({ services }: Props) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function toggleAvailability(service: VendorServiceItem) {
    setBusyId(service.id);

    try {
      const result = await secureFetch(
        `/vendor/services/${service.id}/availability`,
        {
          method: "PATCH",
          body: JSON.stringify({ isActive: !service.isActive }),
        }
      );
      toast.success(result.message);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setBusyId(null);
    }
  }

  async function deleteService(service: VendorServiceItem) {
    setBusyId(service.id);

    try {
      const result = await secureFetch(`/vendor/services/${service.id}`, {
        method: "DELETE",
      });
      toast.success(result.message);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setBusyId(null);
    }
  }

  if (services.length === 0) {
    return (
      <Card className="items-center border border-dashed border-[#eadfda] px-5 py-14 text-center ring-0">
        <BriefcaseBusiness size={32} className="text-[#8c2338]" />
        <h2 className="font-serif text-xl font-bold text-[#2b2023]">
          No Services Yet
        </h2>
        <p className="text-sm text-[#806c72]">
          Add your first wedding service to start receiving bookings.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <Card
          key={service.id}
          className="flex-col gap-4 border border-[#eadfda] p-4 shadow-sm ring-0 sm:flex-row"
        >
          <div className="h-36 w-full shrink-0 overflow-hidden rounded-lg bg-[#f6e9eb] sm:h-28 sm:w-40">
            {service.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={service.image}
                alt={service.serviceName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-[#806c72]">
                No image
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="font-serif text-lg font-bold text-[#2b2023]">
                  {service.serviceName}
                </h2>
                <p className="text-xs text-[#8c2338]">{service.category}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={`h-6 px-3 capitalize ${badgeStyles[service.status]}`}
                >
                  {service.status}
                </Badge>
                <Badge
                  variant="outline"
                  className={`h-6 px-3 ${
                    service.isActive
                      ? "border-sky-300 bg-sky-50 text-sky-800"
                      : "border-gray-300 bg-gray-50 text-gray-600"
                  }`}
                >
                  {service.isActive ? "Available" : "Hidden"}
                </Badge>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#806c72]">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {service.location}
              </span>
              <span className="font-semibold text-[#8c2338]">
                ${service.price.toLocaleString("en-US")}
              </span>
            </div>

            {service.status === "rejected" && (
              <p className="mt-2 text-xs text-rose-700">
                Rejected by admin and hidden from customers. Edit it to send it
                for review again.
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={busyId !== null}
                onClick={() => toggleAvailability(service)}
              >
                {busyId === service.id
                  ? "Processing..."
                  : service.isActive
                    ? "Hide Service"
                    : "Make Available"}
              </Button>

              <Link
                href={`/dashboard/services/${service.id}/edit`}
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                <Pencil />
                Edit
              </Link>

              <Button
                type="button"
                variant="destructive"
                size="lg"
                disabled={busyId !== null}
                onClick={() =>
                  confirmToast(`Delete "${service.serviceName}"?`, () =>
                    deleteService(service)
                  )
                }
              >
                <Trash2 />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

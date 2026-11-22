"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BriefcaseBusiness, MapPin, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { secureFetch } from "@/lib/api/secure-fetch";
import { confirmToast } from "@/lib/confirm-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ServiceStatus = "pending" | "approved" | "rejected";

export interface AdminServiceItem {
  id: string;
  serviceName: string;
  category: string;
  price: number;
  location: string;
  description: string;
  image: string;
  vendorName: string;
  vendorEmail: string;
  status: ServiceStatus;
  isActive: boolean;
}

interface Props {
  services: AdminServiceItem[];
}

// Labels for the status filter dropdown
const STATUS_FILTERS: Record<string, string> = {
  all: "All Statuses",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const badgeStyles: Record<ServiceStatus, string> = {
  pending: "border-amber-300 bg-amber-50 text-amber-800",
  approved: "border-emerald-300 bg-emerald-50 text-emerald-800",
  rejected: "border-rose-300 bg-rose-50 text-rose-700",
};

export default function AdminServicesTable({ services }: Props) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  // Search by service, vendor or location + filter by status
  const keyword = search.trim().toLowerCase();
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.serviceName.toLowerCase().includes(keyword) ||
      service.vendorName.toLowerCase().includes(keyword) ||
      service.location.toLowerCase().includes(keyword);
    const matchesStatus = status === "all" || service.status === status;
    return matchesSearch && matchesStatus;
  });

  async function changeStatus(id: string, newStatus: ServiceStatus) {
    setBusyId(id);

    try {
      const result = await secureFetch(`/admin/services/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
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

  async function deleteService(service: AdminServiceItem) {
    setBusyId(service.id);

    try {
      const result = await secureFetch(`/admin/services/${service.id}`, {
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

  return (
    <div>
      {/* Search & filter */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#806c72]"
          />
          <Input
            type="text"
            placeholder="Search by service, vendor or location"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-11 rounded-xl bg-white pl-9"
          />
        </div>

        <Select
          items={STATUS_FILTERS}
          value={status}
          onValueChange={(value) => {
            if (value) setStatus(String(value));
          }}
        >
          <SelectTrigger
            aria-label="Filter by status"
            className="h-11 w-full rounded-xl bg-white px-4 data-[size=default]:h-11 sm:w-48"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} sideOffset={6} className="rounded-xl p-1">
            {Object.entries(STATUS_FILTERS).map(([itemValue, label]) => (
              <SelectItem key={itemValue} value={itemValue} className="rounded-lg py-2.5">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredServices.length === 0 ? (
        <Card className="items-center border border-dashed border-[#eadfda] px-5 py-14 text-center ring-0">
          <BriefcaseBusiness size={32} className="text-[#8c2338]" />
          <p className="font-medium text-[#2b2023]">No services found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredServices.map((service) => (
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
                    <p className="text-xs text-[#8c2338]">
                      {service.category}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className={`h-6 px-3 capitalize ${badgeStyles[service.status]}`}
                    >
                      {service.status}
                    </Badge>
                    {!service.isActive && (
                      <Badge
                        variant="outline"
                        className="h-6 border-gray-300 bg-gray-50 px-3 text-gray-600"
                      >
                        Hidden by vendor
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#806c72]">
                  <span>
                    Vendor: {service.vendorName}
                    {service.vendorEmail && ` (${service.vendorEmail})`}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {service.location}
                  </span>
                  <span className="font-semibold text-[#8c2338]">
                    ${service.price.toLocaleString("en-US")}
                  </span>
                </div>

                <p className="mt-2 line-clamp-2 text-sm text-[#806c72]">
                  {service.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {service.status !== "approved" && (
                    <Button
                      type="button"
                      size="lg"
                      disabled={busyId !== null}
                      onClick={() => changeStatus(service.id, "approved")}
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      Approve
                    </Button>
                  )}

                  {service.status !== "rejected" && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="lg"
                      disabled={busyId !== null}
                      onClick={() => changeStatus(service.id, "rejected")}
                    >
                      Reject
                    </Button>
                  )}

                  {service.status !== "pending" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      disabled={busyId !== null}
                      onClick={() => changeStatus(service.id, "pending")}
                    >
                      Move to Pending
                    </Button>
                  )}

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
                    {busyId === service.id ? "Processing..." : "Delete"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

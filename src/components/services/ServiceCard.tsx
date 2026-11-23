
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  Crown,
  Store,
} from "lucide-react";

import type { WeddingService } from "@/types/service";
import { buttonVariants } from "@/components/ui/button";

interface ServiceCardProps {
  service: WeddingService;
}

export default function ServiceCard({
  service,
}: ServiceCardProps) {
  const image = service.images?.[0];

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#eadfda] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Service Image */}
      <div className="relative h-56 overflow-hidden bg-[#f6e9eb]">
        {image ? (
          <Image
            src={image}
            alt={service.serviceName}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#9b747d]">
            No image available
          </div>
        )}

        {/* Service Category */}
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-[#8b2339]">
          {service.category}
        </span>

        {/* Premium Vendor Badge */}
        {service.isPremiumVendor && (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-[#2b2023] shadow-sm">
            <Crown className="h-3.5 w-3.5" />
            Premium Vendor
          </span>
        )}
      </div>

      {/* Service Information */}
      <div className="space-y-4 p-5">
        <div>
          <h3 className="line-clamp-2 font-serif text-xl font-bold text-[#2B2023]">
            {service.serviceName}
          </h3>

          <p className="mt-2 flex items-center gap-1 text-sm text-[#806c72]">
            <MapPin className="h-4 w-4 text-[#8b2339]" />
            {service.location}
          </p>
        </div>

        {/* Description */}
        <p className="line-clamp-2 min-h-10 text-sm leading-5 text-[#806c72]">
          {service.description}
        </p>

        {/* Vendor */}
        <div className="flex items-center gap-2 border-t border-[#f0e5e1] pt-4 text-sm text-[#806c72]">
          <Store className="h-4 w-4 text-[#8b2339]" />

          <span className="truncate">
            {service.vendorName}
          </span>
        </div>

        {/* Price and Details */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-[#806c72]">
              Starting from
            </p>

            <p className="text-2xl font-bold text-[#8b2339]">
              ${service.price.toLocaleString("en-US")}
            </p>
          </div>

          <Link
            href={`/services/${service._id}`}
            className={buttonVariants({
              size: "lg",
              className: "h-11 rounded-xl px-4",
            })}
          >
            View Details
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

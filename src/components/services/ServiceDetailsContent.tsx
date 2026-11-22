
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Crown, MapPin } from "lucide-react";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";
import {
  getServiceById,
  isValidServiceId,
} from "@/lib/api/services";
import BookingForm from "@/components/bookings/BookingForm";

interface Props {
  id: string;
}

export default async function ServiceDetailsContent({
  id,
}: Props) {
  if (!isValidServiceId(id)) {
    notFound();
  }

  const service = await getServiceById(id);

  if (!service) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Service details are private: send logged-out users to sign in.
  if (!session?.user) {
    redirect("/login");
  }

  let role: string | null = null;
  let isBlocked = false;

  if (ObjectId.isValid(session.user.id)) {
    const user = await db.collection("user").findOne({
      _id: new ObjectId(session.user.id),
    });

    role = typeof user?.role === "string" ? user.role : null;
    isBlocked = user?.isBlocked === true;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <Link
        href="/services"
        className="mb-8 inline-flex items-center gap-2 text-[#8b2339] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Browse Services
      </Link>

      <div className="grid items-start gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {service.images?.length ? (
            service.images.map((image, index) => (
              // External images are displayed without requiring
              // Next.js remote image configuration.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${image}-${index}`}
                src={image}
                alt={`${service.serviceName} image ${index + 1}`}
                className="w-full rounded-2xl object-cover"
              />
            ))
          ) : (
            <div className="rounded-2xl bg-[#f6e9eb] p-20 text-center text-[#806c72]">
              No images available
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[#eadfda] bg-white p-7">
          <p className="text-sm font-medium text-[#8b2339]">
            {service.category}
          </p>

          <h1 className="mt-3 font-serif text-3xl font-bold text-[#2b2023]">
            {service.serviceName}
          </h1>

          <p className="mt-4 flex items-center gap-2 text-[#806c72]">
            <MapPin className="h-4 w-4" />
            {service.location}
          </p>

          <p className="mt-6 text-3xl font-bold text-[#8b2339]">
            ${service.price.toLocaleString("en-US")}
          </p>

          <h2 className="mt-8 font-serif text-xl font-bold text-[#2b2023]">
            About This Service
          </h2>

          <p className="mt-3 whitespace-pre-line leading-7 text-[#806c72]">
            {service.description}
          </p>

          <div className="mt-8 border-t border-[#eadfda] pt-6">
            <h2 className="font-serif text-xl font-bold text-[#2b2023]">
              Vendor Information
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p className="text-[#806c72]">{service.vendorName}</p>

              {service.isPremiumVendor && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-[#2b2023]">
                  <Crown className="h-3.5 w-3.5" />
                  Premium Vendor
                </span>
              )}
            </div>
          </div>

          {isBlocked ? (
            <div className="mt-8 rounded-xl bg-[#f8edef] p-4 text-sm text-[#8c2338]">
              Your account is restricted from making bookings.
            </div>
          ) : role === "customer" ? (
            <BookingForm serviceId={service._id} />
          ) : (
            <div className="mt-8 rounded-xl bg-[#f8edef] p-4 text-sm text-[#806c72]">
              Only customer accounts can request bookings.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { ArrowLeft } from "lucide-react";

import { requireUser } from "@/lib/require-user";
import { db } from "@/lib/mongodb";
import ServiceForm from "@/components/services/ServiceForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: Props) {
  const user = await requireUser(["vendor"]);
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    notFound();
  }

  // Ownership check: vendors can only edit their own services
  const service = await db.collection("services").findOne({
    _id: new ObjectId(id),
    vendorId: user.id,
  });

  if (!service) {
    notFound();
  }

  return (
    <section className="rounded-2xl border border-[#eadfda] bg-white p-5 sm:p-7">
      <Link
        href="/dashboard/services"
        className="mb-4 inline-flex items-center gap-2 text-sm text-[#8c2338] hover:underline"
      >
        <ArrowLeft size={16} />
        Back to My Services
      </Link>

      <h1 className="font-serif text-3xl font-bold text-[#2b2023]">
        Edit Service
      </h1>

      <p className="mb-6 mt-2 text-sm text-[#806c71]">
        Update your service details. Changes are reviewed by an admin again.
      </p>

      <ServiceForm
        initialData={{
          id: String(service._id),
          serviceName: String(service.serviceName ?? ""),
          category: String(service.category ?? ""),
          description: String(service.description ?? ""),
          price: Number(service.price ?? 0),
          location: String(service.location ?? ""),
          images: Array.isArray(service.images)
            ? service.images.map((image: unknown) => String(image))
            : [],
        }}
      />
    </section>
  );
}

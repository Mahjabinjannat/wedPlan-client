// import Link from "next/link";
// import { ArrowRight } from "lucide-react";

// import ServiceCard from "@/components/services/ServiceCard";
// import { getFeaturedServices } from "@/lib/api/services";
// import type { WeddingService } from "@/types/service";

// export default async function FeaturedServices() {
//   let services: WeddingService[] = [];
//   let error = false;

//   try {
//     services = await getFeaturedServices(6);
//   } catch (err) {
//     console.error("Failed to fetch featured services:", err);
//     error = true;
//   }

//   return (
//     <section className="bg-white px-4 py-20 sm:px-6">
//       <div className="mx-auto max-w-7xl">
//         <div className="mb-12 text-center">
//           <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#8b2339]">
//             Handpicked for You
//           </p>

//           <h2 className="font-serif text-3xl font-bold text-[#2B2023] md:text-4xl">
//             Featured Wedding Services
//           </h2>

//           <p className="mt-3 text-[#806c72]">
//             Explore beautiful services from wedding professionals.
//           </p>
//         </div>

//         {error ? (
//           <p className="py-12 text-center text-[#806c72]">
//             Featured services are temporarily unavailable.
//           </p>
//         ) : services.length === 0 ? (
//           <p className="py-12 text-center text-[#806c72]">
//             Featured wedding services are coming soon.
//           </p>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {services.map((service) => (
//               <ServiceCard key={service._id} service={service} />
//             ))}
//           </div>
//         )}

//         <div className="mt-12 text-center">
//           <Link
//             href="/services"
//             className="inline-flex items-center gap-2 rounded-xl bg-[#8b2339] px-7 py-3 font-medium text-white transition-colors hover:bg-[#6d1a2c]"
//           >
//             Explore All Services
//             <ArrowRight className="h-4 w-4" />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }

import Link from "next/link";
import { connection } from "next/server";
import { ArrowRight } from "lucide-react";

import ServiceCard from "@/components/services/ServiceCard";
import { getFeaturedServices } from "@/lib/api/services";
import type { WeddingService } from "@/types/service";

export default async function FeaturedServices() {
  // Wait for an actual incoming request before fetching data.
  // This prevents fetch() from running during static prerendering.
  await connection();

  let services: WeddingService[] = [];
  let error = false;

  try {
    services = await getFeaturedServices(6);
  } catch (err) {
    console.error("Failed to fetch featured services:", err);
    error = true;
  }

  return (
    <section className="bg-white px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#8b2339]">
            Handpicked for You
          </p>

          <h2 className="font-serif text-3xl font-bold text-[#2B2023] md:text-4xl">
            Featured Wedding Services
          </h2>

          <p className="mt-3 text-[#806c72]">
            Explore beautiful services from wedding professionals.
          </p>
        </div>

        {error ? (
          <p className="py-12 text-center text-[#806c72]">
            Featured services are temporarily unavailable.
          </p>
        ) : services.length === 0 ? (
          <p className="py-12 text-center text-[#806c72]">
            Featured wedding services are coming soon.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl bg-[#8b2339] px-7 py-3 font-medium text-white transition-colors hover:bg-[#6d1a2c]"
          >
            Explore All Services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

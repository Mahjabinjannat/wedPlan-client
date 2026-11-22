import { Suspense } from "react";

import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedServices from "@/components/home/FeaturedServices";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";

// Shown while featured services load from the API.
// Next.js 16 requires data fetching to be inside <Suspense>.
function FeaturedServicesLoading() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 h-10 w-72 max-w-full animate-pulse rounded-lg bg-[#f1e4e7]" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-96 animate-pulse rounded-2xl bg-[#f6e9eb]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Suspense fallback={<FeaturedServicesLoading />}>
        <FeaturedServices />
      </Suspense>
      <WhyChooseUs />
      <HowItWorks />
    </>
  );
}

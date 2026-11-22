
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Camera,
  Building2,
  Flower2,
  UtensilsCrossed,
  Sparkles,
  Shirt,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    name: "Photography & Videography",
    description: "Capture every beautiful moment",
    icon: Camera,
  },
  {
    name: "Wedding Venues",
    description: "Find the perfect celebration space",
    icon: Building2,
  },
  {
    name: "Decoration & Florist",
    description: "Bring your wedding vision to life",
    icon: Flower2,
  },
  {
    name: "Catering Services",
    description: "Delight your guests with great food",
    icon: UtensilsCrossed,
  },
  {
    name: "Makeup & Styling",
    description: "Look your best on your special day",
    icon: Sparkles,
  },
  {
    name: "Wedding Fashion",
    description: "Discover your dream wedding outfit",
    icon: Shirt,
  },
];

export default function Categories() {
  return (
    <section
      id="categories"
      className="scroll-mt-24 bg-[#FCFAF9] px-5 py-20 md:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8c2338]">
            Our Categories
          </span>

          <h2 className="mt-3 font-serif text-3xl font-bold md:text-5xl">
            Everything for Your Perfect Day
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-[#806c71]">
            Explore wedding services tailored to make
            every moment of your celebration special.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.06,
                }}
              >
                <Link
                  href={`/services?category=${encodeURIComponent(category.name)}`}
                  className="group flex h-full flex-col rounded-2xl border border-[#eadfda] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#c995a0] hover:shadow-lg"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f8e9ed] text-[#8c2338]">
                    <Icon size={27} strokeWidth={1.7} />
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#2b2023]">
                        {category.name}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#806c71]">
                        {category.description}
                      </p>
                    </div>

                    <ArrowUpRight
                      size={20}
                      className="shrink-0 text-[#8c2338] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

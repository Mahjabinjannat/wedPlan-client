
"use client";

import { motion } from "motion/react";
import {
  ShieldCheck,
  SearchCheck,
  CalendarCheck,
  HeartHandshake,
} from "lucide-react";

const benefits = [
  {
    title: "Verified Wedding Professionals",
    description:
      "Discover services reviewed through our platform's approval process.",
    icon: ShieldCheck,
  },
  {
    title: "Easy Service Discovery",
    description:
      "Explore different categories and find wedding professionals in one place.",
    icon: SearchCheck,
  },
  {
    title: "Simple Booking Requests",
    description:
      "Send booking requests and track their progress from your dashboard.",
    icon: CalendarCheck,
  },
  {
    title: "Connect with Vendors",
    description:
      "Share your celebration details with professionals offering wedding services.",
    icon: HeartHandshake,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#f8eff1] px-5 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8c2338]">
            Why WedPlan?
          </span>

          <h2 className="mt-3 font-serif text-3xl font-bold md:text-5xl">
            Wedding Planning Made Easier
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-[#806c71]">
            We bring wedding services and planning tools
            together in one convenient platform.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className="rounded-2xl border border-[#eadfda] bg-white p-7 text-center shadow-sm"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f8e9ed] text-[#8c2338]">
                  <Icon size={29} strokeWidth={1.7} />
                </div>

                <h3 className="font-serif text-xl font-bold">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#806c71]">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
